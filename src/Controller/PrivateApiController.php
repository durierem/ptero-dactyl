<?php

namespace App\Controller;

use App\Entity\Text;
use App\Entity\Benchmark;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class PrivateApiController extends AbstractController
{
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

        $entityManager->persist($benchmark);
        $entityManager->flush();
        return new Response("done");
    }

    /**
     * @Route("/text/random", name="random_text")
     */
    public function random(Request $request): Response
    {
        if (!$request->isXmlHttpRequest()) {
            throw new HttpException(403, "Unauthorized request: private API");
        }

        $text = $this->getDoctrine()
            ->getRepository(Text::class)
            ->findRandom();

        return new Response($text->getContent());
    }
}
