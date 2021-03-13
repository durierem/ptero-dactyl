<?php

namespace App\Controller;

use App\Entity\Benchmark;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class DactylotestController extends AbstractController
{
    public function main(): Response
    {
        return $this->render('dactylotest.html.twig');
    }

    /**
     * @Route("/dactylotest/save", name="save_dactylotest")
     */    
    public function save(Request $request): Response
    {
        if (!$request->isXmlHttpRequest()) {
          throw new HttpException(403, "not ajax.");
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
}
