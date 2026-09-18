<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Routing\Attribute\Route;

/** Serves the static landing page without requiring Twig. */
#[AsController]
final class HomeController
{
    #[Route('/', name: 'home', methods: ['GET'])]
    public function __invoke(): Response
    {
        return new Response(file_get_contents(dirname(__DIR__, 2).'/templates/home.html'));
    }
}
