package dev.hr.rezaei.buildflow.quote;

public enum QuoteUnit {
    SQUARE_METER("m²"),
    SQUARE_FOOT("ft²"),
    CUBIC_METER("m³"),
    CUBIC_FOOT("ft³"),
    METER("m"),
    FOOT("ft"),
    EACH("each"),
    KILOGRAM("kg"),
    TON("ton"),
    LITER("L"),
    MILLILITER("mL"),
    HOUR("hr"),
    DAY("day");

    private final String unit;

    QuoteUnit(String unit) {
        this.unit = unit;
    }

    public String getUnit() {
        return unit;
    }
}
