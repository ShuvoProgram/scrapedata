const puppeteer = require('puppeteer')

const multiPageScraper = async(url,pages = 1) => {
    console.log('opening the browser....')
    const browser = await puppeteer.launch({headless: false, args: ['--no-sandbox', '--disable-gpu']})
    const page = await browser.newPage()
    console.log(`Navigating to ${url}...`)
    await page.goto(url, {waiteUntil: 'load'})

    const totalPages = pages
    let questions = []

    for (let initialPage = 1; initialPage <= totalPages; initialPage++){
        console.log(`Collecting the question of page ${initialPage}...`)
        let pageQuesition = await page.evaluate(()=>{
            return[...document.querySelectorAll('.athing')].map((question)=>{
                return {
                    title: question.querySelector('.titlelink').innerText
                    // excerpt: question.querySelector('').innerText,
                }
            })
        })
        questions = questions.concat(pageQuesition)
        console.log(questions)
        //Go to next page until the total number of pages to scrape is reached
        if(initialPage < totalPages){
            await Promise.all([
                await page.click('a.morelink'),
                await page.waitFor(3000),
                await page.waitForSelector('.athing'),
            ])
        }
    }
    console.log('Closing the browser....')

    await page.close()
    await browser.close()
    console.log('Job done!')
    return questions
}

module.exports = {
    multiPageScraper
}