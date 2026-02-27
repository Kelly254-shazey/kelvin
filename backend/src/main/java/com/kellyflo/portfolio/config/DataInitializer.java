package com.kellyflo.portfolio.config;

import com.kellyflo.portfolio.model.AdminUser;
import com.kellyflo.portfolio.model.Project;
import com.kellyflo.portfolio.model.ProjectStatus;
import com.kellyflo.portfolio.model.ServiceItem;
import com.kellyflo.portfolio.model.SiteContent;
import com.kellyflo.portfolio.model.Skill;
import com.kellyflo.portfolio.model.Video;
import com.kellyflo.portfolio.repository.AdminUserRepository;
import com.kellyflo.portfolio.repository.ProjectRepository;
import com.kellyflo.portfolio.repository.ServiceItemRepository;
import com.kellyflo.portfolio.repository.SiteContentRepository;
import com.kellyflo.portfolio.repository.SkillRepository;
import com.kellyflo.portfolio.repository.VideoRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Value("${app.admin.username}")
    private String seedUsername;

    @Value("${app.admin.password}")
    private String seedPassword;

    @Value("${app.admin.email}")
    private String seedEmail;

    @Bean
    public CommandLineRunner seedData(AdminUserRepository adminUserRepository,
            SiteContentRepository siteContentRepository,
            ServiceItemRepository serviceItemRepository,
            SkillRepository skillRepository,
            ProjectRepository projectRepository,
            VideoRepository videoRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            if (adminUserRepository.count() == 0) {
                AdminUser admin = new AdminUser();
                admin.setUsername(seedUsername);
                admin.setEmail(seedEmail);
                admin.setPassword(passwordEncoder.encode(seedPassword));
                admin.setRole("ROLE_ADMIN");
                admin.setEnabled(true);
                adminUserRepository.save(admin);
            }

            if (siteContentRepository.count() == 0) {
                siteContentRepository.save(new SiteContent());
            }

            if (serviceItemRepository.count() == 0) {
                serviceItemRepository.saveAll(List.of(
                        service("Web Development", "Building modern and responsive websites", "</>", 1),
                        service("System Architecture", "Robust backend and scalable solutions", "▤", 2),
                        service("Brand & Design", "Crafting unique logos and visual identities", "✦", 3),
                        service("Academic Writing", "Research papers and scholarly articles", "🗎", 4),
                        service("UI/UX Design", "User-centered interface design", "▣", 5),
                        service("Payment Integration", "M-Pesa and Stripe payment integrations", "◈", 6)));
            }

            if (skillRepository.count() == 0) {
                skillRepository.saveAll(List.of(
                        skill("Frontend", "React", 95),
                        skill("Frontend", "Tailwind CSS", 92),
                        skill("Frontend", "Framer Motion", 90),
                        skill("Backend", "Spring Boot", 94),
                        skill("Backend", "Spring Security", 90),
                        skill("Database", "MySQL", 91),
                        skill("DevOps", "Docker", 82),
                        skill("Design", "UI/UX Systems", 88)));
            }

            if (projectRepository.count() == 0) {
                projectRepository.saveAll(List.of(
                        project(
                                "FinFlow Payments Platform",
                                "finflow-payments-platform",
                                "Cross-border payment and reconciliation suite for SMEs.",
                                "Enterprise-ready payment platform with role-based access, transaction analytics, and reconciliation workflows.",
                                List.of("Java", "Spring Boot", "MySQL", "React"),
                                "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1200&q=80",
                                "https://example.com/finflow",
                                "https://github.com/kelvin-simiyu/finflow",
                                true,
                                ProjectStatus.PUBLISHED),
                        project(
                                "Nova Design System",
                                "nova-design-system",
                                "Reusable UI system with premium interactions and consistency.",
                                "Comprehensive component library and style tokens for faster product delivery across web apps.",
                                List.of("React", "Tailwind CSS", "UI/UX"),
                                "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
                                "https://example.com/nova-design-system",
                                "https://github.com/kelvin-simiyu/nova-design-system",
                                true,
                                ProjectStatus.PUBLISHED),
                        project(
                                "TutorPro LMS",
                                "tutorpro-lms",
                                "Learning management platform with dashboards and analytics.",
                                "Education product for course delivery, assignment workflows, progress tracking, and instructor insights.",
                                List.of("Java", "React", "Projects"),
                                "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
                                "https://example.com/tutorpro",
                                "https://github.com/kelvin-simiyu/tutorpro-lms",
                                false,
                                ProjectStatus.PUBLISHED)));
            }

            if (videoRepository.count() == 0) {
                videoRepository.saveAll(List.of(
                        video(
                                "Spring Boot JWT Authentication Deep Dive",
                                "Full setup from security config to role-protected APIs.",
                                "Java",
                                "https://www.youtube.com/watch?v=KxqlJblhzfI",
                                "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
                                true),
                        video(
                                "React Glassmorphism Portfolio",
                                "Building premium portfolio UI using React and Tailwind.",
                                "React",
                                "https://vimeo.com/76979871",
                                "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
                                true),
                        video(
                                "Product UI/UX Breakdown",
                                "Design hierarchy and interaction strategy for modern products.",
                                "UI/UX",
                                "https://www.youtube.com/watch?v=Vj4wV4U4kGk",
                                "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&q=80",
                                true),
                        video(
                                "Project Architecture Walkthrough",
                                "How to structure scalable full-stack projects from day one.",
                                "Projects",
                                "https://www.youtube.com/watch?v=Q33KBiDriJY",
                                "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1200&q=80",
                                true)));
            }
        };
    }

    private ServiceItem service(String title, String description, String icon, int displayOrder) {
        ServiceItem item = new ServiceItem();
        item.setTitle(title);
        item.setDescription(description);
        item.setIcon(icon);
        item.setDisplayOrder(displayOrder);
        return item;
    }

    private Skill skill(String category, String name, Integer level) {
        Skill item = new Skill();
        item.setCategory(category);
        item.setName(name);
        item.setLevel(level);
        return item;
    }

    private Project project(String title,
            String slug,
            String summary,
            String description,
            List<String> techTags,
            String thumbnailUrl,
            String liveUrl,
            String githubUrl,
            boolean featured,
            ProjectStatus status) {
        Project item = new Project();
        item.setTitle(title);
        item.setSlug(slug);
        item.setSummary(summary);
        item.setDescription(description);
        item.setTechTags(techTags);
        item.setThumbnailUrl(thumbnailUrl);
        item.setLiveUrl(liveUrl);
        item.setGithubUrl(githubUrl);
        item.setGalleryImages(List.of(thumbnailUrl));
        item.setFeatured(featured);
        item.setStatus(status);
        return item;
    }

    private Video video(String title,
            String description,
            String category,
            String videoUrl,
            String thumbnailUrl,
            boolean published) {
        Video item = new Video();
        item.setTitle(title);
        item.setDescription(description);
        item.setCategory(category);
        item.setVideoUrl(videoUrl);
        item.setThumbnailUrl(thumbnailUrl);
        item.setPublished(published);
        return item;
    }
}
