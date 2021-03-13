<?php

namespace App\Controller;

use App\Entity\Text;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class TextController extends AbstractController
{
    /**
     * @Route("/text/random", name="text")
     */
    public function random(): Response
    {
        $text = $this->getDoctrine()
            ->getRepository(Text::class)
            ->findRandom();

        return new Response($text->getContent());
    }
}
