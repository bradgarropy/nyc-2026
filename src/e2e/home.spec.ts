import {expect, test} from "@playwright/test"

test("home page renders the trip map", async ({page}) => {
    await page.goto("/")
    await expect(page).toHaveTitle("nyc 2026")

    await expect(
        page.getByRole("img", {name: "NYC 2026 trip map"}),
    ).toBeVisible()
})
