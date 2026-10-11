package ru.mas.toximas.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Контроллер для SPA (Single Page Application).
 * Все запросы, не относящиеся к API и статике, перенаправляются на index.html,
 * чтобы React Router работал при обновлении страницы.
 */
@Controller
public class SpaController {

    @GetMapping(value = {"/", "/{path:[^\\.]*}"})
    public String forward() {
        return "forward:/index.html";
    }
}