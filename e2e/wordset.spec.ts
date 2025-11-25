import { test, expect } from "@playwright/test";

test.describe("WordSet Management", () => {
  test("should create a new wordset and add words", async ({ page }) => {
    // Navigate to wordsets page
    await page.goto("/wordsets");

    // Click create button
    await page.click('a[href="/wordsets/new"]');
    await expect(page).toHaveURL(/\/wordsets\/new/);

    // Fill in form
    await page.fill('input[placeholder="예: TOEFL 단어"]', "Test Set");
    await page.fill(
      'textarea[placeholder*="설명"]',
      "This is a test set"
    );

    // Submit form
    await page.click('button:has-text("생성")');

    // Should redirect to detail page
    await page.waitForURL(/\/wordsets\/[a-z0-9]+$/);

    // Verify set was created
    await expect(page.locator("h1")).toContainText("Test Set");

    // Add a word
    await page.fill('input[placeholder="단어"]', "apple");
    await page.fill('input[placeholder="의미"]', "사과");
    await page.click('button:has-text("추가")');

    // Verify word was added
    await expect(page.locator("table")).toContainText("apple");
    await expect(page.locator("table")).toContainText("사과");
  });

  test("should display wordsets on list page", async ({ page }) => {
    await page.goto("/wordsets");

    // Check if the page loads
    await expect(page.locator("h1")).toContainText("단어 세트");

    // Check for create button
    await expect(page.locator('a[href="/wordsets/new"]')).toBeVisible();
  });

  test("should update wordset information", async ({ page }) => {
    // Create a wordset first
    await page.goto("/wordsets");
    await page.click('a[href="/wordsets/new"]');
    await page.fill('input[placeholder="예: TOEFL 단어"]', "Original Name");
    await page.click('button:has-text("생성")');
    await page.waitForURL(/\/wordsets\/[a-z0-9]+$/);

    // Click edit button
    await page.click('button:has-text("수정")');

    // Update information
    await page.fill('input[value="Original Name"]', "Updated Name");
    await page.click('button:has-text("저장")');

    // Verify update
    await expect(page.locator("h1")).toContainText("Updated Name");
  });

  test("should delete a wordset", async ({ page }) => {
    // Create a wordset
    await page.goto("/wordsets");
    await page.click('a[href="/wordsets/new"]');
    await page.fill('input[placeholder="예: TOEFL 단어"]', "To Delete");
    await page.click('button:has-text("생성")');
    await page.waitForURL(/\/wordsets\/[a-z0-9]+$/);

    // Delete the set
    await page.click('button:has-text("삭제")');
    await page.on("dialog", (dialog) => dialog.accept());

    // Should redirect to list page
    await page.waitForURL("/wordsets");

    // Verify set is not in list
    await expect(page.locator("text=To Delete")).not.toBeVisible();
  });

  test("should handle empty wordsets list gracefully", async ({ page }) => {
    await page.goto("/wordsets");

    // Check for empty state message or create button
    const hasEmptyMessage = await page
      .locator("text=첫 세트를 만들어보세요")
      .isVisible();
    const hasCreateButton = await page
      .locator('a[href="/wordsets/new"]')
      .isVisible();

    // At least one should be true
    expect(hasEmptyMessage || hasCreateButton).toBeTruthy();
  });
});
