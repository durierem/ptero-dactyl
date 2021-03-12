<?php

namespace App\Controller\Admin;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use App\Entity\Benchmark;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

use EasyCorp\Bundle\EasyAdminBundle\Field\ArrayField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use Symfony\Component\HttpKernel\Exception\HttpException;

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

    public function save(Request $request): Response
    {
        if (!$request->isXmlHttpRequest()) {
          throw new HttpException(403, "not ajax.");
        }
        $data = $request->request->get('data');
        $decoded = json_decode($data, true);

        $entityManager = $this->getDoctrine()->getManager();

        $benchmark = new Benchmark();
        $benchmark->setData($decoded);
        $benchmark->setUser($this->getUser());

        $entityManager->persist($benchmark);
        $entityManager->flush();
        return new Response("done");
    }
}
