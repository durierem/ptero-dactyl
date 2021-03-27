<?php

namespace App\DataFixtures;

use App\Entity\Text;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class TextFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        $manager->persist((new Text())
                ->setSource("Wikipédia - Dactylographie")
                ->setSourceUrl("https://fr.wikipedia.org/wiki/Dactylographie")
                ->setContent(
                    "La dactylographie est l'action de saisir un texte sur " .
                        "un clavier. Celui qui pratique la dactylographie, en tant que loisir " .
                        "ou métier, est un dactylographe. La pratique du métier nécessite " .
                        "l'utilisation de ses dix doigts avec rapidité, fluidité et précision " .
                        "et de ne pas regarder les touches du clavier mais de garder le " .
                        "regard sur le texte à saisir."
                )
        );

        $manager->persist((new Text())
                ->setSource("Wikipédia - A Book Like This")
                ->setSourceUrl("https://fr.wikipedia.org/wiki/A_Book_Like_This")
                ->setContent("A Book Like This est le premier album du duo de musique folk Angus " .
                    "and Julia Stone, un frère et une soeur, compositeurs-interprètes, " .
                    "originaires d'Australie. Paru en 2007, l'album est produit par Ian " .
                    "Pritchett, Fran Healy et Angus & Julia Stone.")
        );

        $manager->persist((new Text())
                ->setSource("Wikipédia - John William Dunne")
                ->setSourceUrl("https://fr.wikipedia.org/wiki/John_William_Dunne")
                ->setContent("John William Dunne, né le 2 décembre 1875 à Curragh Camp (Irlande) " .
                    "et mort le 24 juin 1949 à Banbury (Angleterre) est un ingénieur " .
                    "aéronautique, précurseur de l'onirologie et psychologue " .
                    "expérimentateur britannique.")
        );

        $manager->persist((new Text)
                ->setSource("Wikipédia - Grotte de l'Aguzou")
                ->setSourceUrl("https://fr.wikipedia.org/wiki/Grotte_de_l%27Aguzou")
                ->setContent("La grotte d'Aguzou s'ouvre sur le flanc nord-ouest du pic d'Aguzou. " .
                    "Elle se situe dans le département de l'Aude, aux confins de " .
                    "l'Ariège, entre les villes d'Axat et d'Usson, au sud de Quillan, " .
                    "sur la commune de Escouloubre.")
        );

        $manager->persist((new Text)
                ->setSource("Wikipédia - Déclaration de Cambridge sur la conscience")
                ->setSourceUrl("https://fr.wikipedia.org/wiki/D%C3%A9claration_de_Cambridge_sur_la_conscience")
                ->setContent("La Déclaration de Cambridge sur la Conscience fait référence au " .
                    "manifeste signé en juin 2012 dans l'Université de Cambridge durant " .
                    "une série de conférences sur la conscience chez les animaux humains " .
                    "et non humains ; la Déclaration conclut que les animaux non humains " .
                    "ont une conscience analogue à celle des animaux humains.")
        );

        $manager->flush();
    }
}
