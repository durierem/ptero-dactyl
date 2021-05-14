<?php

namespace App\Controller;

use DateTime;
use App\Repository\BenchmarkRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class LeaderBoardController extends AbstractController
{
    /**
     * @Route("/leaderboard", name="leaderboard")
     */
    public function leaderboard(BenchmarkRepository $benchmarkRepository): Response
    {
        $data = $benchmarkRepository->getAll();

        $data = array_map(function($row) {
            $uid = $row->getUser()->getId();
            $username = $row->getUser()->getUsername();
            $created_at = $this->formatDate($row->getCreatedAt());
            return ["uid" => $uid,
                    "name" => $username ,
                    "score" => $this->getBest($row->getData()),
                    "date" => $created_at,
                    ];
        }, $data);

        usort($data, function($a, $b) {
            if ($a["score"] == $b["score"]) {
                return 0;
            }
            return ($a["score"] > $b["score"]) ? -1 : 1;
        });

        $data = $this->deleteDuplicates($data); 

        $data = array_slice($data, 0, 10);

        return $this->render('leaderboard.html.twig', ["dataTable" => $data]);
    }

    /**
     * @return int best of the three benchmark of a serie
     * @param Array an array containing the data of a benchmark serie
     */
    private function getBest($row): int
    {
        $best = 0;
        foreach ($row as $key => $field) {
            if (preg_match("/^b\d$/", $key)) {
                $time = $field['time'] / 1000;
                $curr = round(count($field["word_times"]) / $time * 60, 1);
                $best = max($best, $curr);
            }
        }
        return $best;
    }

    /**
     * @return Array an array containing 1 row per user id
     * @param Array an array containing all the benchmarks
     */
    private function deleteDuplicates($array): Array
    {
        $keys = [];
        $idx = 0;
        $result = [];

        foreach ($array as $row) {
            if (!in_array($row['uid'], $keys)) {
                $keys[$idx] = $row['uid'];
                $result[$idx] = $row;
            }
            ++$idx;
        }
        return $result;
    }

    /**
     * @return String Returns a string with $date formated
     * @param DateTime $date the date to format
     */
    private function formatDate(DateTime $date): String
    {
        $day = $date->format('d/m/Y');
        $time = $date->format('H:i:s');
        return $day . " @ " . $time;
    }
}
