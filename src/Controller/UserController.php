<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Repository\BenchmarkRepository;
use DateTime;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends AbstractController
{
    /**
    * @Route("/user", name="user_panel")
    */
    public function panel(BenchmarkRepository $benchmarkRepository): Response
    {
        $data = $benchmarkRepository->getUserData($this->getUser()->getId());

        foreach ($data as &$row) {
            foreach($row as $key=>&$value) {
                if ($key == "created_at") {
                    $value = $this->formatDate($value);
                } else if ($key == "data") {
                    $value = $this->formatData($value);
                }
            }
        }
        return $this->render('userpanel.html.twig', ["dataTable"=>$data]);
    }

    /**
     * @return Array Returns an array containing filtered test data
     * @param Array $test An array containing row test data
     */
    private function formatData(Array $test): Array
    {
        $res = [];
        foreach ($test as $key=>$value) {
            if (preg_match("/^b\d$/", $key)) {
                $time = round($value["time"]/1000, 1);
                if (!isset($res['wpm'])) {
                    $res["wpm"] = round(count($value["word_times"]) / $time * 60, 1);
                } else {
                    $res['wpm'] += round(count($value["word_times"]) / $time * 60, 1);
                    $res['wpm'] /= 2;
                }
                if (!isset($res['misChar'])) {
                    $res["misChar"] = $value["character_errors"];
                } else {
                    $res['misChar'] += $value['character_errors'];
                }
                if (!isset($res['misWord'])) {
                    $res["misWord"] = $value["nb_false_word"];
                } else {
                    $res['misWord'] += $value['nb_false_word'];
                }
            } else {
                $res = array_merge($res, array($key=>$value));
            }
        }
        return $res;
    }

    /**
     * @return String Returns a string with $date formated
     * @param DateTime $date the date to format
     */
    private function formatDate(DateTime $date): String
    {
        $day = date_format($date, 'd/m/Y');
        $time = date_format($date, 'H:i:s');
        return $day." @ ".$time;
    }
}
