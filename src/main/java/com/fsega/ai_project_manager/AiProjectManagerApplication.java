package com.fsega.ai_project_manager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class AiProjectManagerApplication {

	public static void main(String[] args) {
		SpringApplication.run(AiProjectManagerApplication.class, args);
	}

}
