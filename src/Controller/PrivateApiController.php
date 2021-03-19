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

class PrivateApiController extends AbstractController
{
    const BENCHMARK = 'benchmark';
    const EXERCISE = 'exercise';
    const END = 'save_dactylotest';

    private $sequence = [
        self::BENCHMARK,
        self::EXERCISE,
        self::EXERCISE,
        self::BENCHMARK,
        self::EXERCISE,
        self::EXERCISE,
        self::BENCHMARK,
        self::END
    ];

    /**
     * @Route("/dactylotest/session")
     */
    public function session(SessionInterface $session)
    {
        $currentStep = $session->get('step', -1);

        $nextStep = $currentStep + 1;

        if ($nextStep >= count($this->sequence)) {
            $nextStep = 0;
        }

        $session->set('step', $nextStep);

        $nextRoute = $this->sequence[$nextStep];
        return $this->redirectToRoute($nextRoute);
    }

    /**
     * @Route("/dactylotest/save", name="save_dactylotest")
     */
    public function save(Request $request): Response
    {
        if (!$request->isXmlHttpRequest()) {
            throw new HttpException(403, "Unauthorized request: private API");
        }

        $data = $request->request->get('data');
        $decoded = json_decode($data, true);

        $entityManager = $this->getDoctrine()->getManager();

        $benchmark = new Benchmark();
        $benchmark->setData($decoded);
        $benchmark->setUser($this->getUser());
        $benchmark->setCreatedAt(new DateTime('now'));

        $entityManager->persist($benchmark);
        $entityManager->flush();

        $this->addFlash('benchDone', 'vos données ont été sauvegardées.');

        return $this->redirectToRoute('home');
    }

    /**
     * @Route("/text/random", name="random_text")
     */
    public function random(Request $request, TextRepository $textRepository): Response
    {
        if (!$request->isXmlHttpRequest()) {
            throw new HttpException(403, "Unauthorized request: private API");
        }

        $prevIds = $request->request->get('bDone');

        $decoded = json_decode($prevIds, true);
        $decoded = $decoded == null ? [] : $decoded;

        $text = $textRepository->findRandom($decoded);

        return $this->json([
            "id" => $text->getId(),
            "content" => $text->getContent()
        ]);
    }

    /**
     * @Route("/exercise/getone", name="get_exercise")
     */
    public function exercise(Request $request, ExerciseRepository $exerciseRepository, SessionInterface $session): Response
    {
        if (!$request->isXmlHttpRequest()) {
            throw new HttpException(403, "Unauthorized request: private API");
        }

        $last = $session->get('last');
        $exercise = $exerciseRepository->findExercise($last);
        $session->set('last', $exercise->getTag());

        return $this->json([
            "tag" => $exercise->getTag(),
            "content" => $exercise->getContent()
        ]);
    }
}
