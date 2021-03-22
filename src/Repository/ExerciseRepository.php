<?php

namespace App\Repository;

use App\Entity\Exercise;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Exercise|null find($id, $lockMode = null, $lockVersion = null)
 * @method Exercise|null findOneBy(array $criteria, array $orderBy = null)
 * @method Exercise[]    findAll()
 * @method Exercise[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ExerciseRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Exercise::class);
    }

    /**
     * @return Exercise If $tag == '' returns a random exercise, else if $tag !=
     * '' AND $id == -1 returns an exercise with Tag != $tag, else returns an
     * exercise with Tag == $tag AND $id != $id
     * @param int $id Id of an exercise
     * @param String $tag Tag of an exercise
     */
    public function findExercise(int $id, String $tag): ?Exercise
    {
        if ($tag == '') {
            $exercises = $this->createquerybuilder('e')
                ->getquery()
                ->getresult();
        } else if ($tag != '' && $id == -1) {
            $exercises = $this->createquerybuilder('e')
                ->andwhere('e.tag <> :tag')
                ->setparameter('tag', $tag)
                ->getquery()
                ->getresult();
        } else {
            $params = array(
                  'id' => $id,
                  'tag' => $tag
            );

            $exercises = $this->createquerybuilder('e')
                ->where('e.id <> :id')
                ->andwhere('e.tag = :tag')
                ->setparameters($params)
                ->getquery()
                ->getresult();
        }

        return $exercises[random_int(0, count($exercises) - 1)];
    }

    // /**
    //  * @return Exercise[] Returns an array of Exercise objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('e')
            ->andWhere('e.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('e.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Exercise
    {
        return $this->createQueryBuilder('e')
            ->andWhere('e.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
