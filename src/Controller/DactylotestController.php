<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class DactylotestController extends AbstractController
{
    public function main(): Response
    {
        return $this->render('dactylotest.html.twig');
    }
}
