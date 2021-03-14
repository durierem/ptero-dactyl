<?php

namespace App\Controller\Admin;

use App\Entity\Benchmark;
use App\Entity\User;

use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;


class DashboardController extends AbstractDashboardController
{
    /**
     * @Route("/admin", name="admin")
     * @IsGranted("ROLE_ADMIN")
     */
    public function index(): Response
    {/*
        return parent::index();*/
        $routeBuilder = $this->get(AdminUrlGenerator::class);
        return $this->render('admin/index.html.twig', [
            'userCrudRoute' => $routeBuilder->setController(UserCrudController::class)->generateUrl(),
            'benchmarkCrudRoute' => $routeBuilder->setController(BenchmarkCrudController::class)->generateUrl(),
        ]);
    }

    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setFaviconPath('/images/small_gra.ico')
            ->setTitle('Ptero Dactyl Dashboard');
    }

    public function configureMenuItems(): iterable
    {
        return [
            MenuItem::linktoDashboard('Dashboard', 'fa fa-home'),
            MenuItem::linkToCrud('Users', 'fa fa-user', User::class),
            MenuItem::linkToCrud('Benchmarks', 'fa fa-file-text', Benchmark::class),
        ];
    }
}
