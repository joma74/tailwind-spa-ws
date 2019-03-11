import { Selector, ClientFunction } from "testcafe"
import pretty from "pretty"
import identifyUserAgent from "./utils/identify-useragent"

fixture("Index_Page_Test")
  .page("http://localhost:8080/dist/index.html")
  .beforeEach(async (t) => {
    await t.resizeWindow(1280, 1024) // SXGA
  })

const getUA = ClientFunction(() => navigator.userAgent)

const testName = "dom_has_critical_elements"

test(testName, async (t) => {
  const ua = await getUA()

  await t.takeScreenshot(
    t.testRun.test.fixture.name +
      "/" +
      t.testRun.test.name +
      "/" +
      identifyUserAgent(ua) +
      "/" +
      "scsh_1.png",
  )

  /**
   * @type { SelectorAPI & HTMLElement & { fontFamily: Promise<String> & String} }
   */
  const heading = await /** @type { ? } */ (Selector(
    "h1[data-desc='heading']",
  ).addCustomDOMProperties({
    // @ts-ignore
    fontFamily: (/** @type {HTMLElement} */ el) => el.style.fontFamily,
  }))

  let headingText = await heading.innerText

  await t.expect(headingText).eql("Greetings hot-updateable tailwindcss")

  // #1 via computed style
  await t
    .expect(heading.getStyleProperty("font-family"))
    .contains("Luckiest Guy")

  // #2 but own style is empty

  await t.expect(heading.fontFamily).eql("")

  const svgDashboard = await Selector("svg[data-desc='dashboard']")

  await t.expect(svgDashboard.visible).ok()

  /**
   * @type { SelectorAPI & HTMLImageElement }
   */
  const subheadline = await /** @type { ? } */ (Selector(
    "p[data-desc='subheadline']",
  ).addCustomDOMProperties({
    // @ts-ignore
    innerHTML: (/** @type {HTMLElement} */ el) => el.innerHTML,
  }))

  const expectedSubHeadlineValue = pretty(`
  	<svg data-desc="dashboard" class="w-6 h-6 opacity-50 fill-current relative mr-2">
  		<use href="src/assets/svg/toolbar.svg#dashboard"></use>
	</svg>
	Powered by
	<svg data-desc="cog" class="w-6 h-6 opacity-50 fill-current relative ml-2">
		<use href="src/assets/svg/toolbar.svg#cog"></use>
    </svg>`)

  const actualSubHeadlineValue = await subheadline.innerHTML

  await t.expect(pretty(actualSubHeadlineValue)).eql(expectedSubHeadlineValue)

  const svgCog = await Selector("svg[data-desc='cog']")

  await t.expect(svgCog.visible).ok()

  const imageWebpack = await Selector("img[data-desc='webpack']")

  await t.expect(imageWebpack.visible).ok()

  const imageVue = await Selector("img[data-desc='vue']")

  await t.expect(imageVue.visible).ok()
})
