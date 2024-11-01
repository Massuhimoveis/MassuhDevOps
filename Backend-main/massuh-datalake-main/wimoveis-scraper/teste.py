from DrissionPage import ChromiumPage
from DrissionPage.errors import ElementLostError, NoRectError
import time

def is_captcha_page(driver):
    """Check if the current page contains a CAPTCHA challenge."""
    try:
        captcha_text = driver.ele('text:Confirme que você é humano', timeout=5)
        return captcha_text is not None
    except:
        return False

def wait_for_human_to_solve_captcha():
    """Wait for human intervention to solve CAPTCHA."""
    print("CAPTCHA detected. Please solve the CAPTCHA in the browser window.")
    time.sleep(1)
    # input("Press Enter after solving the CAPTCHA...")

def extract_page_data(page):
    data = []
    
    postings_container = page.ele('@class:postings-container', timeout=5)
    if postings_container:
        postings_container.scroll.to_see()
        cards = postings_container.eles('@class:CardContainer-sc-1tt2vbg-5 fvuHxG')
        for card in cards:
            item = {}
            try:
                card.scroll.to_see()  # Ensures the element is in view
            except NoRectError:
                print("Skipping card with NoRectError")
                continue

            # Extracting information
            titulo = card.ele('@class:LocationAddress-sc-ge2uzh-0 iylBOA postingAddress')
            item['titulo'] = titulo.text if titulo else "N/A"

            bairro = card.ele('@class:LocationLocation-sc-ge2uzh-2 fziprF')
            item['bairro'] = bairro.text if bairro else "N/A"

            preco = card.ele('@class:Price-sc-12dh9kl-3 geYYII')
            item['preco'] = preco.text if preco else "N/A"

            condominio = card.ele('@class:Expenses-sc-12dh9kl-1 iboaIF')
            item['condominio'] = condominio.text if condominio else "N/A"
            
            features = card.ele('@class:PostingMainFeaturesBlock-sc-1uhtbxc-0 cHDgeO')
            item['features_list'] = [ft.text for ft in features.eles('tag:span')] if features else []

            conteiner_descricao = card.ele('@class:PostingDescription-sc-i1odl-11 fECErU')  
            item['descricao'] = conteiner_descricao.text if conteiner_descricao else "N/A"
            item['url_imovel'] = conteiner_descricao.ele('tag:a').attr('href') if conteiner_descricao else "N/A"

            conteiner_logo_advertiser = card.ele('@class:Logo-sc-hlm4rl-2 czToXI')
            item['logo_anunciante'] = conteiner_logo_advertiser.attr('src') if conteiner_logo_advertiser else "N/A"

            # Handling image extraction, considering lazy loading and potential multiple sources
            slider_container = card.ele('@class:flickity-slider')
            item['imgs'] = []
            if slider_container:
                print("slider container localizado")
                imgs = slider_container.eles('tag:img')
                for img in imgs:
                    # Check for src or data-flickity-lazyload attribute
                    src = img.attr('src')
                    lazy_src = img.attr('data-flickity-lazyload')
                    item['imgs'].append(src if src else lazy_src)

            data.append(item)
    else:
        print("Elemento 'postings-container' não encontrado.")
    
    return data

def load_daily_updates():
    page = ChromiumPage()

    base_url = "https://www.wimoveis.com.br/venda/imoveis/df"
    query_parameters = "?publicationDate=1&sort=more_recent"
    page_number = 1

    results = []
    try:
        page.get(f"{base_url}{query_parameters}")

        while True:
            if page_number > 5: break # Parar após página 5
            
            # if is_captcha_page(page):
            #     wait_for_human_to_solve_captcha()
            #     page.get(f"{base_url}{query_parameters}")

            data = extract_page_data(page)
            results.extend(data)
            
            try:
                next_button = page.ele('@data-qa=PAGING_NEXT', timeout=10)
                if next_button:
                    next_button.click()
                    page_number += 1
                    time.sleep(1)
                else:
                    print("No more pages found.")
                    break
            except (ElementLostError, NoRectError):
                print("Error encountered. Trying to relocate next button.")
                next_button = page.ele('@data-qa=PAGING_NEXT', timeout=10)
                if next_button:
                    next_button.click()
                    page_number += 1
                else:
                    print("No more pages found.")
                    break
    finally:
        page.quit()
    return results

if __name__ == "__main__":
    data = load_daily_updates()
    print(data)