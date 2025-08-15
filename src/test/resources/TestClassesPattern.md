# # Test Class Naming

- If the test class contains unit tests, it should be named after the class under test, with "Test" appended.
- If the test class contains integration tests, it should be named after the class under test, with "IntegrationTest"
  appended.

# Test Method Naming

All test method names must follow this pattern:

    xXX_shouldYYY_whenZZZ()

Where:

- xXX is the method name under test
- YYY is the expected behaviour
- ZZZ is the condition of the test

# Assertion Guidelines

- Do not assert on log messages or log levels.
- Do not assert on exception messages.
- Statically import "org.junit.jupiter.api.Assertions.*" and use them.

# Test Class Structure

- If there's a preparation phase, it should be in a method annotated with @BeforeEach.
- If there's a cleanup phase, it should be in a method annotated with @AfterEach.
- If temporary files are created, they should be deleted in the @AfterEach method.


