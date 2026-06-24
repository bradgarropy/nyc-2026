import {expect, test} from "@playwright/test"

test.beforeEach(async ({page}) => {
    await page.goto("/")
})

test("filtering to a day shows only that day's itinerary", async ({page}) => {
    const day2 = page.getByRole("button", {name: "Day 2", exact: true})

    await day2.click()
    await expect(day2).toHaveAttribute("aria-pressed", "true")

    await expect(
        page.getByRole("region", {name: "Day 2 itinerary"}),
    ).toBeVisible()
    await expect(
        page.getByRole("region", {name: "Day 1 itinerary"}),
    ).toHaveCount(0)

    await page.getByRole("button", {name: "All Days", exact: true}).click()
    await expect(
        page.getByRole("region", {name: "Day 1 itinerary"}),
    ).toBeVisible()
})

test("clicking a map stop opens its detail panel", async ({page}) => {
    // Click the inner <circle>: center-clicking the wrapping <g> misses (the
    // group's bounding-box center is empty).
    await page.locator('g[aria-label="Times Square"] circle').first().click()

    const dialog = page.getByRole("dialog")
    await expect(dialog).toBeVisible()
    await expect(
        dialog.getByRole("heading", {name: "Times Square"}),
    ).toBeVisible()

    await dialog.getByRole("button", {name: "Close panel"}).click()
    await expect(page.getByRole("dialog")).toHaveCount(0)
})

test("clicking an itinerary stop opens its panel, Escape closes it", async ({
    page,
}) => {
    await page
        .getByRole("region", {name: "Day 1 itinerary"})
        .getByRole("button", {name: "Macy's"})
        .click()

    const dialog = page.getByRole("dialog")
    await expect(dialog.getByRole("heading", {name: "Macy's"})).toBeVisible()

    await page.keyboard.press("Escape")
    await expect(page.getByRole("dialog")).toHaveCount(0)
})
