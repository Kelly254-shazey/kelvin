package com.kellyflo.portfolio.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.URL;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "site_content")
public class SiteContent extends BaseEntity {

    @NotBlank
    @Size(max = 80)
    @Column(nullable = false, length = 80)
    private String brandName = "KELLYFLO";

    @NotBlank
    @Size(max = 180)
    @Column(nullable = false, length = 180)
    private String heroTitle = "Crafting Digital Experiences";

    @NotBlank
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String heroHighlight = "Future";

    @NotBlank
    @Size(max = 240)
    @Column(nullable = false, length = 240)
    private String heroSubheadline = "Creative Developer • Brand Designer • Systems Architect";

    @NotBlank
    @Size(max = 700)
    @Column(nullable = false, length = 700)
    private String heroDescription = "I design and build powerful digital systems that merge creativity and technology into impactful solutions.";

    @NotBlank
    @Size(max = 80)
    @Column(nullable = false, length = 80)
    private String heroPrimaryCtaText = "View My Work";

    @NotBlank
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String heroPrimaryCtaLink = "#work";

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String heroSecondaryCtaText = "Let's Build Something iconic";

    @NotBlank
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String heroSecondaryCtaLink = "#contact";

    @NotBlank
    @Size(max = 60)
    @Column(nullable = false, length = 60)
    private String heroTagOne = "Full Stack Developer";

    @NotBlank
    @Size(max = 60)
    @Column(nullable = false, length = 60)
    private String heroTagTwo = "UI/UX Expert";

    @NotBlank
    @Size(max = 60)
    @Column(nullable = false, length = 60)
    private String heroTagThree = "Payment Integrations";

    @NotBlank
    @URL
    @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String profileImageUrl = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80";

    @NotBlank
    @Size(max = 180)
    @Column(nullable = false, length = 180)
    private String aboutTitle = "Who is Kelvin Simiyu?";

    @NotBlank
    @Size(max = 500)
    @Column(nullable = false, length = 500)
    private String aboutDescription = "I'm a multidisciplinary creative engineer dedicated to transforming ideas into reality.";

    @NotBlank
    @Size(max = 20)
    @Column(nullable = false, length = 20)
    private String statOneValue = "50+";

    @NotBlank
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String statOneLabel = "Projects Completed";

    @NotBlank
    @Size(max = 20)
    @Column(nullable = false, length = 20)
    private String statTwoValue = "10+";

    @NotBlank
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String statTwoLabel = "Technologies Mastered";

    @NotBlank
    @Size(max = 20)
    @Column(nullable = false, length = 20)
    private String statThreeValue = "20+";

    @NotBlank
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String statThreeLabel = "Clients Served";

    @NotBlank
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String servicesTitle = "My Services";

    @NotBlank
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String workTitle = "Work / Projects";

    @NotBlank
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String skillsTitle = "Skills";

    @NotBlank
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String testimonialsTitle = "Testimonials";

    @NotBlank
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String videosTitle = "Videos Showcase";

    @NotBlank
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String contactTitle = "Contact";

    @NotBlank
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String contactCardTitle = "Reach Me";

    @NotBlank
    @Size(max = 80)
    @Column(nullable = false, length = 80)
    private String navHireCtaText = "Hire Me";

    @NotBlank
    @Size(max = 180)
    @Column(nullable = false, length = 180)
    private String contactEmail = "kelly123simiyu@gmail.com";

    @NotBlank
    @URL
    @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String whatsappUrl = "https://wa.me/254741178450";

    @NotBlank
    @URL
    @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String linkedinUrl = "https://www.linkedin.com/in/kelvin-simiyu-b04244354";

    @NotBlank
    @URL
    @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String githubUrl = "https://github.com/Kelly254-shazey";

    @NotBlank
    @URL
    @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String tiktokUrl = "https://www.tiktok.com/@kelly.the.money.m";

    @Size(max = 255)
    @Column(length = 255)
    private String resumeOriginalName;

    @Size(max = 255)
    @Column(length = 255)
    private String resumeStoredName;

    @Column(nullable = false)
    private boolean resumeVisible = false;

    @Column(nullable = false)
    private boolean resumeDownloadEnabled = false;

    @Size(max = 255)
    @Column(length = 255)
    private String cvOriginalName;

    @Size(max = 255)
    @Column(length = 255)
    private String cvStoredName;

    @Column(nullable = false)
    private boolean cvVisible = false;

    @Column(nullable = false)
    private boolean cvDownloadEnabled = false;
}
