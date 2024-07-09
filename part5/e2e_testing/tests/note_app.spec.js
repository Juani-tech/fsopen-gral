const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createNote } = require('./helper')

describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Juani',
        username: 'juani',
        password: 'pdc',
      },
    })

    await page.goto('/')
  })

  test('front page can be opened', async ({ page }) => {
    const locator = page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(
      page.getByText(
        'Note app, Department of Computer Science, University of Helsinki 2023',
      ),
    ).toBeVisible()
  })

  test('login form can be opened', async ({ page }) => {
    await loginWith(page, 'juani', 'pdc')

    // Me olvide de ponerle user.name, por lo que printea 'vacio'
    await expect(page.getByText('Juani logged-in')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await page.getByRole('button', { name: 'log in' }).click()
    await page.getByTestId('username').fill('juani')
    await page.getByTestId('password').fill('wrong')
    await page.getByRole('button', { name: 'login' }).click()

    // Esto es para asegurar de que el error aparece en el lugar correcto (.error)
    const errorDiv = page.locator('.error')
    await expect(errorDiv).toContainText('Wrong credentials')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    await expect(page.getByText('Juani logged in')).not.toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'juani', 'pdc')
    })

    test('a new note can be created', async ({ page }) => {
      await createNote(page, 'a note created by playwright', true)

      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })

    describe('and several notes exists', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'first note', true)
        await createNote(page, 'second note', true)
        await createNote(page, 'third note', true)
      })

      test('importance can be changed', async ({ page }) => {
        await page.pause()
        const otherNoteText = page.getByText('second note')
        const otherdNoteElement = otherNoteText.locator('..')

        await otherdNoteElement
          .getByRole('button', { name: 'make not important' })
          .click()
        await expect(
          otherdNoteElement.getByText('make important'),
        ).toBeVisible()
      })
    })
  })
})
