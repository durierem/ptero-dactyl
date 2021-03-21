<?php

namespace App\Repository;

use App\Entity\Benchmark;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Benchmark|null find($id, $lockMode = null, $lockVersion = null)
 * @method Benchmark|null findOneBy(array $criteria, array $orderBy = null)
 * @method Benchmark[]    findAll()
 * @method Benchmark[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class BenchmarkRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Benchmark::class);
    }

    public function getUserData(int $userId): ?Array
    {
        return $this->createQueryBuilder('u')
            ->select('u.data', 'u.created_at')
            ->andWhere('u.user = :uid')
            ->setParameter('uid', $userId)
            ->getQuery()
            ->getResult()
        ;
    }


    // /**
    //  * @return Benchmark[] Returns an array of Benchmark objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('b')
            ->andWhere('b.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('b.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Benchmark
    {
        return $this->createQueryBuilder('b')
            ->andWhere('b.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
