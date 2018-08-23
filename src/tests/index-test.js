import { Selector, ClientFunction } from "testcafe"
import pretty from "pretty"

fixture("Index Page Test").page("http://localhost:8080/dist/index.html")

test("dom has critical elements", async (t) => {
  const heading = await Selector("h1[data-desc='heading']")

  let headingText = await heading.innerText

  await t.expect(headingText).eql("Greetings hot-updateable tailwindcss")

  const svgDashboard = await Selector("svg[data-desc='dashboard']")

  await t.expect(svgDashboard.visible).ok()

  const subheadline = await Selector("p[data-desc='subheadline']")

  const subheadlineValue = await t.eval(() => subheadline().innerHTML, {
    dependencies: { subheadline },
  })

  const expectedSubHeadlineValue = pretty(`
  	<svg data-desc="dashboard" class="w-6 h-6 opacity-50 fill-current relative mr-2">
  		<use href="src/assets/svg/toolbar.svg#dashboard"></use>
	</svg>
	Powered by
	<svg data-desc="cog" class="w-6 h-6 opacity-50 fill-current relative ml-2">
		<use href="src/assets/svg/toolbar.svg#cog"></use>
	</svg>`)

  await t.expect(pretty(subheadlineValue)).eql(expectedSubHeadlineValue)

  const svgCog = await Selector("svg[data-desc='cog']")

  await t.expect(svgCog.visible).ok()

  const imageWebpack = await Selector("img[data-desc='webpack']")

  await t.expect(imageWebpack.visible).ok()

  const imageVue = await Selector("img[data-desc='vue']")

  await t.expect(imageVue.visible).ok()
})
