<?php

namespace App\DataFixtures;

use App\Entity\Exercise;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ExoFixture extends Fixture
{
    public function load(ObjectManager $manager)
    {
        $manager->persist((new Exercise())->setTag("trigramme")->setContent(
            "lle lle lle lle lle lle lle lle lle lle"
        ));
        $manager->persist((new Exercise())->setTag("trigramme")->setContent(
            "que que que que que que que que que que"
        ));
        $manager->persist((new Exercise())->setTag("trigramme")->setContent(
            "nne nne nne nne nne mme mme mme mme mme"
        ));
        $manager->persist((new Exercise())->setTag("trigramme")->setContent(
            "ion ion ion ion ion ion ion ion ion ion"
        ));
        $manager->persist((new Exercise())->setTag("trigramme")->setContent(
            "eil eil eil eil eil eil eil eil eil eil"
        ));

        $manager->persist((new Exercise())->setTag("ponct")->setContent(
            "Oh l'Amérique ! Etats-Unis d'Amérique... \"A l'ouest se trouvent " .
                "les Mines d'Argent\". Jamais, je ne pourrai te rendre 5€, " .
                "la monnaie de ta pièce."
        ));

        $manager->persist((new Exercise())->setTag("ponct")->setContent(
            "Le milieu, la terre, l'enfant ; tout n'est peut-être pas " .
                "tel qu'il est dit : un esprit ? Non ! Un fantôme... "
        ));

        $manager->persist((new Exercise)->setTag("ponct")->setContent(
            "La maison mère disait \"Haha je ne crois pas en dieu ? " .
                "Peut être !\" Rien de tel qu'une (immense !) conjoncture " .
                "ésotérique, d'une bien pensance : pesante."
        ));

        $manager->persist((new Exercise())->setTag("ponct")->setContent(
            "Ce texte, est un texte fait... Pour vous faire travailler... " .
                "Les ponctuations. Arretez de comprendre ce que vous lisez, " .
                "écrivez plus (vite) ! Mille sabords ! Imaginez une suite de " .
                "caractères. Dénuée de sens, vide d'interêt."
        ));

        // $manager->persist(
        //     (new Exercise())->setTag("ponct")
        //         ->setContent(". -- ? : == ___ \" ++ - . __ . + --, Je vous ai bien eu..! S'écriait il ! " .
        //             "Retour chariot. / o -_- o \ Niveau ultra hardcore : activé Bim ! Cet exercice, " .
        //             "à été, ehuu.. généré par la contrainte. D'un développeur étudiant en quête de son diplôme. " .
        //             "Snif, Snif, libérez moi. Adieu monde cruel: je ne te vois plus. Est-ce là une mésaventure ?")
        // );

        $manager->persist((new Exercise())->setTag("peucourant")->setContent(
            "Barguigner Cacochyme Chryséléphantine Circonlocution Heuristique"
        ));

        $manager->persist((new Exercise())->setTag("peucourant")->setContent(
            "Haquenée Idiosyncrasie Zinzinuler Aréopage Gougnafier"
        ));

        $manager->persist((new Exercise())->setTag("peucourant")->setContent(
            "Obséquieux Diligent Alacrité Sérendipité Pérégrin Nidoreux"
        ));

        $manager->persist((new Exercise())->setTag("peucourant")->setContent(
            "Clamoxyl Subutex Doliprane Dactylotest Myxozoaire Pénicilline"
        ));


        $manager->persist((new Exercise())->setTag("espacement")->setContent(
            "Avion Humecter Pandémie Moutures Homogène Abricots Insalubrité"
        ));

        $manager->persist((new Exercise())->setTag("espacement")->setContent(
            "Giclures Harangue Humilier Disgrace Incolore Jacasser Pratiquement"
        ));

        $manager->persist((new Exercise())->setTag("espacement")->setContent(
            "Cotière Engoncer Entoiler Insanité Evangile Guitoune"
        ));

        $manager->flush();
    }
}
