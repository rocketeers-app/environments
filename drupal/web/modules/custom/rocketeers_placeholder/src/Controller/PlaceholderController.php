<?php

declare(strict_types=1);

namespace Drupal\rocketeers_placeholder\Controller;

use Symfony\Component\HttpFoundation\Response;

/**
 * Returns the placeholder page as a plain response rather than a render array, so it comes out
 * byte for byte the same as the other environment types' placeholder pages instead of being
 * wrapped in Drupal's front-end theme.
 */
final class PlaceholderController {

  /**
   * Serves the placeholder page.
   */
  public function page(): Response {
    $html = (string) file_get_contents(dirname(__DIR__, 2) . '/templates/placeholder.html');

    return new Response($html, Response::HTTP_OK, [
      'Content-Type' => 'text/html; charset=UTF-8',
      'X-Robots-Tag' => 'noindex, nofollow',
    ]);
  }

}
