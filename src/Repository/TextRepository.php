<?php

namespace App\Repository;

use App\Entity\Text;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Text|null find($id, $lockMode = null, $lockVersion = null)
 * @method Text|null findOneBy(array $criteria, array $orderBy = null)
 * @method Text[]    findAll()
 * @method Text[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TextRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Text::class);
    }

    /**
     * @return Text Returns a randomly selected Text
     * @param int[] $prevIds the ids of the previous texts we don't want to get
     */
    public function findRandom(array $prevIds): Text
    {
        $texts = $this->createQueryBuilder('t')
            ->getQuery()
            ->getResult()
        ;

        foreach ($texts as $key=>$text) {
            if (in_array($text->getId(), $prevIds)) {
                unset($texts[$key]);
            }
        }

        $res = array_values($texts);

        return $res[random_int(0, count($texts) - 1)];
    }

    // /**
    //  * @return Text[] Returns an array of Text objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('t.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Text
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
