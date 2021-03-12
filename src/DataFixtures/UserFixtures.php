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
        $user->setUsername("admin");
        $user->setPassword($this->passwordEncoder->encodePassword(
            $user,
            'amdinpass'
        ));
        $user->setRoles(array('ROLE_ADMIN'));
        $manager->persist($user);

        $user = new User();
        $user->setUsername("user");
        $user->setPassword($this->passwordEncoder->encodePassword(
            $user,
            'userpass'
        ));
        $manager->persist($user);

        $manager->flush();
    }
}
