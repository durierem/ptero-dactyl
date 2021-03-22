<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class AppController extends AbstractController
{

    public function index(): Response
    {
        return $this->render('home.html.twig');
    }

    public function about(): Response
    {
        return $this->render('about.html.twig');
    }
}
