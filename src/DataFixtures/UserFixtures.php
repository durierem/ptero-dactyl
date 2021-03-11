<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use App\Entity\User;

class UserFixtures extends Fixture
{
    private $passwordEncoder;

    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->passwordEncoder = $passwordEncoder;
    }

    public function load(ObjectManager $manager)
    {
        $user = new User();
        $user->setUsername("KaciBgdu76");
        $user->setPassword($this->passwordEncoder->encodePassword(
            $user,
            'newSuperSecretPass'
        ));
        $user->setRoles(array('ROLE_ADMIN'));
        $manager->persist($user);

        $user = new User();
        $user->setUsername("RémiGigaUltraSwag");
        $user->setPassword($this->passwordEncoder->encodePassword(
            $user,
            'MotdePassDe#MecSwag76'
        ));
        $user->setRoles(array('ROLE_VERDETERRE'));
        $manager->persist($user);

        $manager->flush();
    }
}
