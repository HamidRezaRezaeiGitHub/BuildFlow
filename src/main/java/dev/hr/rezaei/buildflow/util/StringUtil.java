package dev.hr.rezaei.buildflow.util;

public class StringUtil {

    private StringUtil() {
        // Prevent instantiation
    }

    public static String orDefault(String str, String defaultStr) {
        return (str == null || str.isBlank()) ? defaultStr : str;
    }
}
