<?php

namespace App\DataFixtures;

use App\Entity\Exercise;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ExoFixture extends Fixture
{
    public function load(ObjectManager $manager)
    {
        $manager->persist((new Exercise())->setTag("trigramme")->setContent("sel sle esl els les lse sal lis las los sol sul"));
        $manager->persist((new Exercise())->setTag("trigramme")->setContent("que qeu equ euq ueq uqe qua auq que qui iqu uqu"));
        $manager->persist((new Exercise())->setTag("trigramme")->setContent("ent etn net nte tne ten ten net tet tnt ntt eet"));
        $manager->persist((new Exercise())->setTag("trigramme")->setContent("err reu rue rua arr run arr rea era rra err rre"));
        $manager->persist((new Exercise())->setTag("trigramme")->setContent("lle ill lli lle ell ele lel ili ill lii lil ili"));

        $manager->persist(
        (new Exercise())->setTag("ponct")
                        ->setContent("Oh l'Amérique ! États unis d'Amérique... \"À l'ouest se trouvent les \"Mines d'Argent\".
                                      Jamais, je ne pourrai te rendre 5€, la monnaie de ta pièce. Éxactement. Cette dette jamais
                                      ne finira. L'Amiral, Kasparov et son chien débatèrent... Des heures durant !
                                      Ça je n'en doutais point. Mais ? Qu'est ce ?! Condition ternaire : { vrai : faux ? boolean }"));
        $manager->persist(
        (new Exercise())->setTag("ponct")
                        ->setContent("Le milieu, la terre, l'enfant ; tout n'est peut-être pas 
                                      tel qu'il est dit : un esprit ? Non ! Un fantôme... 
                                      La maison mère disait \"haha je ne crois pas\", en dieu ? Peut être ! 
                                      Rien de tel qu'une (immense !) conjoncture ésothérie, d'une bien pensance : pesante."));
        $manager->persist(
        (new Exercise())->setTag("ponct")
                        ->setContent("Ce text, est un texte fait ! pour vous faire travailler... les ponctuations.
                                      Arretez de comprendre, ce que vous lisez, écrivez plus (vite) ! Par 1000 sabords !
                                      Imaginez une suite de caractères. Sans sens, vide d'interet. Machinalement : Votre 
                                      cerveau doit traiter la frappe. Vite !! Moin.. Vite... Éxquis, n'est ce pas ?"));

        $manager->persist(
        (new Exercise())->setTag("ponct")
                        ->setContent(". -- ? : == ___ \" ++ - . __ . + --, Je vous ai bien eu..! S'écriait il !
                                     Retour chariot. / o -_- o \ Niveau ultra hardcore : activé Bim ! Cet exercice, 
                                     à été, ehuu.. généré par la contrainte. D'un développeur étudiant en quête de son diplôme.
                                     Snif, Snif, libérez moi. Adieu monde cruel: je ne te vois plus. Est-ce là une mésaventure ?"));


        $manager->persist(
        (new Exercise())->setTag("peucourant")
                        ->setContent("Barguigner Cacochyme Chryséléphantine Circonlocution Heuristique Maïeutique Praxinoscope
                                      Pyrrhique Satyriasique Syzygie Valétudinaire Poïkilothermie Homéotéleute Eudémonisme"));

        $manager->persist(
        (new Exercise())->setTag("peucourant")
                        ->setContent("Haquenée Idiosyncrasie Chryséléphantine Aréopage Apotropaïque Gougnafier Palidnodie
                                      Phénakistiscope Psittacisme Praxinoscope Hapax gaudriole Emménagogue Zinzinuler"));

        $manager->persist(
        (new Exercise())->setTag("peucourant")
                        ->setContent("Wagon Xylophone Myxozoaire Proxyserez Eéoxyderer Exkysterez Hyméxazol Flytoxez Réasphyxiez
                                      Carboxyliez hydroxylier Inoxyderiez xyloglottez extrayiez Extasiez kawai Crawleront "));

        $manager->persist(
        (new Exercise())->setTag("peucourant")
                        ->setContent("Clamoxyl Subutex meteospasmyl xanax solupred Ginkor Tanakan Dextropropoxyphene Hexaquine
                                      Lysanxia Dacryoserum Thiovalone Dactylotest Kardegic Doliprane Ixprim Helicidine Piascledine"));


        $manager->persist(
        (new Exercise())->setTag("spacement")
                        ->setContent("Avion Pandémie Pratiquement Giclures Moutures Abricots Academie Cotiere Disgrace Engoncer Entoiler
                                      Evangile Guitoune Hablerie Harangue Homogene Humecter Humilier Incolore Insanité Interets Jacasser"));

        $manager->flush();
    }
}
