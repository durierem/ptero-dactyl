<?php

namespace App\Controller;

use DateTime;
use App\Entity\Benchmark;
use App\Repository\TextRepository;
use App\Repository\ExerciseRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Psr\Log\LoggerInterface;

class PrivateApiController extends AbstractController
{
    const BENCHMARK = 'benchmark';
    const EXERCISE = 'exercise';
    const END = 'home';

    const TIMESTAMP_FORMAT = 'd-m-Y @ H:i:s';

    private $sequence = [
        self::BENCHMARK,
        self::EXERCISE,
        self::EXERCISE,
        self::BENCHMARK,
        self::EXERCISE,
        self::EXERCISE,
        self::BENCHMARK,
        self::END,
    ];

    /**
     * @Route("/dactylotest/sequence", name="sequence")
     */
    public function sequence(Request $request, SessionInterface $session, LoggerInterface $logger)
    {
        // Indice de l'étape courante ou 0 dans le cas d'une nouvelle série
        $currentStep = $session->get('step', 0);

        // Détermine si l'utilisateur peut passer à l'étape suivante
        $nextStep = $currentStep;
        if ($request->query->get('isStepFinished', 'false') === 'true') {
            $nextStep += 1;
        }

        $session->set('step', $nextStep);
        $nextRoute = $this->sequence[$nextStep];

        // Nettoie la session lorsque la série est terminée
        if ($nextRoute == self::END) {
            $this->clearSessionVariables($session);
            $logger->info("Session cleared", [
                'user' => $this->getUser()->getUsername()
            ]);
        }

        $logger->info("Redirecting to route '{$nextRoute}' (step {$nextStep})", [
            'user' => $this->getUser()->getUsername()
        ]);
        return $this->redirectToRoute($nextRoute);
    }

    /**
     * @Route("/api/send/benchdata", name="save_dactylotest")
     */
    public function save(Request $request, SessionInterface $session, LoggerInterface $logger): Response
    {
        if (!$request->isXmlHttpRequest()) {
            $logger->error("Not an XHR request");
            throw new HttpException(403, "Unauthorized request: private API");
        }

        $newData = $request->request->get('data');
        $newData = json_decode($newData, true);

        $currData = $session->get('data', []);
        $currStep = $session->get('step');

        $prevIds = $session->get('prev', []);
        array_push($prevIds, $session->get('currTextId', '-1'));
        $session->set('prev', $prevIds);

        if ($currStep == 0) {
            $currData["b1"] = $newData;
            $session->set('data', $currData);
        } else if ($currStep == 3) {
            $currData["b2"] = $newData;
            $session->set('data', $currData);
        } else {
            $currData["b3"] = $newData;
            $date = new DateTime('now');
            $currData["created_at"] = $date->format(self::TIMESTAMP_FORMAT);

            if (!$this->isDataFormatValid($currData)) {
                $logger->error('Invalid data format while saving', [
                    'user' => $this->getUser()->getUsername(),
                    'data' => $currData
                ]);
                $this->addFlash("error", "Une erreur est survenue, les données n'ont pas été sauvegardées (format de données invalide)");
                $this->clearSessionVariables($session);
                throw new HttpException(422, "Invalid data format");
            }

            $entityManager = $this->getDoctrine()->getManager();

            $benchmark = new Benchmark();
            $benchmark->setData($currData);
            $benchmark->setUser($this->getUser());
            $benchmark->setCreatedAt(new DateTime('now'));

            $entityManager->persist($benchmark);
            $entityManager->flush();

            $logger->info('Sequence data saved', [
                'user' => $this->getUser()->getUsername()
            ]);

            $this->addFlash(
                'benchDone',
                'Les données de votre test ont été sauvegardées.'
            );

            $this->addFlash(
                'benchDone',
                'Merci de votre participation ! N\'hésitez pas à recommencer :)'
            );
        }

        return new Response();
    }

    /**
     * @Route("/api/get/rdm_text", name="get_random_text")
     */
    public function random(Request $request, TextRepository $textRepository, SessionInterface $session): Response
    {
        if (!$request->isXmlHttpRequest()) {
            throw new HttpException(403, "Unauthorized request: private API");
        }

        $prevIds = $session->get('prev', []);

        $text = $textRepository->findRandom($prevIds);
        $session->set('currTextId', $text->getId());

        return $this->json($text->toArray());
    }

    const FIRST_EX = 1;
    const SECOND_EX = 2;
    const THIRD_EX = 4;

    /**
     * @Route("/api/get/new_exercise", name="get_exercise")
     */
    public function exercise(Request $request, ExerciseRepository $exerciseRepository, SessionInterface $session): Response
    {
        if (!$request->isXmlHttpRequest()) {
            throw new HttpException(403, "Unauthorized request: private API");
        }

        $lastId = intval($session->get('lastId', '-1'));
        $currTag = $session->get('currTag', '');

        $exercise = $exerciseRepository->findExercise($lastId, $currTag);
        $session->set('lastId', $exercise->getId());
        $session->set('currTag', $exercise->getTag());

        if ($session->get('step') == self::SECOND_EX) {
            $session->remove('lastId');
        }

        if ($session->get('step') == self::FIRST_EX) {
            $data = $session->get('data');
            $data["ex1"] = $exercise->getTag();
            $session->set('data', $data);
        } else if ($session->get('step') == self::THIRD_EX) {
            $data = $session->get('data');
            $data["ex2"] = $exercise->getTag();
            $session->set('data', $data);
        }

        return $this->json($exercise->toArray());
    }

    // TOOL

    private function isDataFormatValid(array $data): bool
    {
        if ($data == []) {
            return false;
        }

        $bCount = 0;
        $eCount = 0;

        foreach ($data as $key => $field) {
            if (preg_match("/^b\d$/", $key)) {
                ++$bCount;
                if (!$this->isBenchDataFormatValid($field)) {
                    return false;
                }
            } else if (preg_match("/^ex\d$/", $key)) {
                ++$eCount;
                if ($field == "") {
                    return false;
                }
            } else if ($key == "created_at") {
                if (!$this->isDateFormatValid($field, self::TIMESTAMP_FORMAT)) {
                    return false;
                }
            } else {
                return false;
            }
        }

        $typeNb = array_count_values($this->sequence);
        return $bCount == $typeNb[self::BENCHMARK]
            && $eCount == $typeNb[self::BENCHMARK] - 1
            && isset($data["created_at"]);
    }

    private function isBenchDataFormatValid(array $data): bool
    {
        if (
            !isset($data['time']) || !isset($data['character_errors'])
            || !isset($data['nb_false_word']) || !isset($data['word_errors'])
            || !isset($data['word_times']) || !isset($data['key_combinations'])
        ) {
            return false;
        }
        if (
            !is_int($data['time']) || !is_int($data['character_errors'])
            || !is_int($data['nb_false_word'])
        ) {
            return false;
        }
        foreach ($data['word_errors'] as $field) {
            foreach ($field as $key => $val) {
                if ($key == 0) {
                    if (!is_string($val)) {
                        return false;
                    }
                } else if (!is_int($val)) {
                    return false;
                }
            }
        }
        foreach ($data['word_times'] as $val) {
            if (!is_int($val)) {
                return false;
            }
        }
        foreach ($data['key_combinations'] as $field) {
            foreach ($field as $key => $val) {
                if ($key == 0) {
                    if (!(is_string($val) && iconv_strlen($val) == 2)) {
                        return false;
                    }
                } else if (!is_int($val)) {
                    return false;
                }
            }
        }
        return true;
    }

    private function isDateFormatValid(String $date, String $format): bool
    {
        $d = DateTime::createFromFormat($format, $date);
        return $d && $d->format($format) == $date;
    }

    private function clearSessionVariables(SessionInterface $session)
    {
        $session->remove('data');
        $session->remove('prev');
        $session->remove('currTextId');
        $session->remove('lastId');
        $session->remove('currTag');
        $session->remove('step');
    }
}
