<?php

namespace App\Controller;

use DateTime;
use App\Entity\Benchmark;
use App\Repository\TextRepository;
use App\Repository\ExerciseRepository;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class PrivateApiController extends AbstractController
{
    const BENCHMARK = 'benchmark';
    const EXERCISE = 'exercise';
    const END = 'home';

    private $sequence = [
        self::BENCHMARK,
        self::EXERCISE,
        self::EXERCISE,
        self::BENCHMARK,
        self::EXERCISE,
        self::EXERCISE,
        self::BENCHMARK
    ];

    /**
     * @Route("/dactylotest/session", name="session")
     */
    public function session(Request $request, SessionInterface $session)
    {
        $currentStep = $session->get('step', 0);

        if ($currentStep >= sizeof($this->sequence) - 1) {
            $session->remove('step');
            return $this->redirectToRoute('home');
        }

        $nextStep = $currentStep;
        if ($request->query->get('isFinished', 'false') === 'true') {
            $nextStep += 1;
        }

        $session->set('step', $nextStep);

        $nextRoute = $this->sequence[$nextStep];
        return $this->redirectToRoute($nextRoute);
    }

    /**
     * @Route("/api/send/benchdata", name="save_dactylotest")
     */
    public function save(Request $request, SessionInterface $session): Response
    {
        if (!$request->isXmlHttpRequest()) {
            throw new HttpException(403, "Unauthorized request: private API");
        }

        $newData = $request->request->get('data');
        $newData = json_decode($newData, true);

        $prevData = $session->get('data', []);
        $currStep = $session->get('step');

        if ($currStep == 0) {
            $newData = array_merge($prevData, array("b1" => $newData));
            $session->set('data', $newData);
        } else if ($currStep == 3) {
            $newData = array_merge($prevData, array("b2" => $newData));
            $session->set('data', $newData);
        } else {
            $finalData = array_merge($prevData, array("b3" => $newData));

            $entityManager = $this->getDoctrine()->getManager();

            $benchmark = new Benchmark();
            $benchmark->setData($finalData);
            $benchmark->setUser($this->getUser());
            $benchmark->setCreatedAt(new DateTime('now'));

            $entityManager->persist($benchmark);
            $entityManager->flush();

            // reset everything
            $session->remove('data');
            $session->remove('prev');
            $session->remove('last');

            $this->addFlash('benchDone', 'vos données ont été sauvegardées.');
        }
        return new Response("etape validee");
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

        array_push($prevIds, $text->getId());
        $session->set('prev', $prevIds);

        return new Response($text->getContent());
    }

    /**
     * @Route("/api/get/new_exercise", name="get_exercise")
     */
    public function exercise(Request $request, ExerciseRepository $exerciseRepository, SessionInterface $session): Response
    {
        if (!$request->isXmlHttpRequest()) {
            throw new HttpException(403, "Unauthorized request: private API");
        }

        if ($session->has('currEx')) {
            $currEx = $session->get('currEx');
            $session->remove('currEx');
            return new Response($currEx);
        }

        $last = $session->get('last', '');
        $exercise = $exerciseRepository->findExercise($last);
        $session->set('last', $exercise->getTag());
        $session->set('currEx', $exercise->getContent());

        if ($session->get('step') == 1) {
            $data = $session->get('data');
            $data["ex1"] = $exercise->getTag();
            $session->set('data', $data);
        } else {
            $data = $session->get('data');
            $data["ex2"] = $exercise->getTag();
            $session->set('data', $data);
        }

        return new Response($exercise->getContent());
    }
}
