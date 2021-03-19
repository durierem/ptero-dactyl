<?php

namespace App\Repository;

use App\Entity\Text;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Query\ResultSetMappingBuilder;
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
     */
    public function findRandom(Array $prevIds): Text
    {
        $entityManager = $this->getEntityManager();

        $ids = implode(',', array_values($prevIds));
        if ($ids == '') {
          $ids = '-1';
        }
        // Impossible d'utiliser rand() avec les builders fournis
        // => on utilise une requête et un mapping manuel :/
        $sql = "SELECT * FROM text WHERE id NOT IN ($ids) ORDER BY rand() LIMIT 1";

        $rsm = new ResultSetMappingBuilder($entityManager);
        $rsm->addRootEntityFromClassMetadata('App\Entity\Text', 't');

        $query = $entityManager->createNativeQuery($sql, $rsm);

        return ($query->getResult())[0];
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
