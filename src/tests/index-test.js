import { Selector } from "testcafe"

fixture("Index Page Test").page("http://localhost:8080/dist/index.html")

test("dom has critical elements", async (t) => {
  const heading = await Selector("h1[data-desc='heading']")

  let headingText = await heading.innerText

  await t.expect(headingText).eql("Greetings hot-updateable tailwindcss")

  const svgDashboard = await Selector("svg[data-desc='dashboard']")

  await t.expect(svgDashboard.visible).ok()

  const svgCog = await Selector("svg[data-desc='cog']")

  await t.expect(svgCog.visible).ok()

  const imageWebpack = await Selector("img[data-desc='webpack']")

  await t.expect(imageWebpack.visible).ok()

  const imageVue = await Selector("img[data-desc='vue']")

  await t.expect(imageVue.visible).ok()
})
