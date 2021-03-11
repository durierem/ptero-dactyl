<?php

namespace App\Controller\Admin;

use App\Entity\Benchmark;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

use EasyCorp\Bundle\EasyAdminBundle\Field\ArrayField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class BenchmarkCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Benchmark::class;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            ArrayField::new('data'),
            TextField::new('user'),
        ];
    }

    /*public function create(): Response
    {
         return $this->render();
    }*/
}
