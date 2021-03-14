<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class DactylotestController extends AbstractController
{
    /**
     * @Route("dactylotest/benchmark", name="benchmark")
     */
    public function benchmark(): Response
    {
        return $this->render('dactylotest.html.twig');
    }

    /**
     * @Route("dactylotest/exercise", name="exercise")
     */
    public function exercise(): Response
    {
        return $this->render('dactylotest.html.twig');
    }
}
