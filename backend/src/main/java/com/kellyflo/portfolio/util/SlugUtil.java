package com.kellyflo.portfolio.util;

import java.util.Locale;

public final class SlugUtil {

    private SlugUtil() {
    }

    public static String toSlug(String value) {
        if (value == null) {
            return "";
        }

        String slug = value.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");

        if (slug.isBlank()) {
            return "item-" + System.currentTimeMillis();
        }
        return slug;
    }
}
