from app import db
from app.models import Stock, SCHEMA, environment
from sqlalchemy.sql import text

# Seed the database with 4 stocks
def seed_stocks():
    # Create watchlists

    stocks_data = [
        {"ticker": "TSLA", "org_name": "Tesla"},
        {"ticker": "AAPL", "org_name": "Apple"},
        {"ticker": "AMZN", "org_name": "Amazon.com"},
        {"ticker": "MSFT", "org_name": "Microsoft Corp"},
        {"ticker": "NVDA", "org_name": "NVIDIA Corp."},
        {"ticker": "GOOGL", "org_name": "Alphabet"},
        {"ticker": "PEP", "org_name": "PepsiCo"},
        {"ticker": "COST", "org_name": "Costco Wholesale Corp"},
        {"ticker": "CMCSA", "org_name": "Comcast Corp"},
        {"ticker": "ADBE", "org_name": "Adobe"},
        {"ticker": "TXN", "org_name": "Texas Instruments"},
        {"ticker": "AVGO", "org_name": "Broadcom"},
        {"ticker": "HON", "org_name": "Honeywell International"},
        {"ticker": "INTC", "org_name": "Intel Corp"},
        {"ticker": "TMUS", "org_name": "T-Mobile US"},
        {"ticker": "SBUX", "org_name": "Starbucks Corp."},
        {"ticker": "NFLX", "org_name": "Netflix"},
        {"ticker": "QCOM", "org_name": "QUALCOMM"},
        {"ticker": "AMD", "org_name": "Advanced Micro Devices"},
        {"ticker": "CSCO", "org_name": "Cisco Systems"},
        {"ticker": "INTU", "org_name": "Intuit"},
        {"ticker": "AMGN", "org_name": "Amgen"},
        {"ticker": "AMAT", "org_name": "Applied Materials"},
        {"ticker": "GILD", "org_name": "Gilead Sciences"},
        {"ticker": "MDLZ", "org_name": "Mondelez International"},
        {"ticker": "ADI", "org_name": "Analog Devices"},
        {"ticker": "ADP", "org_name": "Automatic Data Processing"},
        {"ticker": "ISRG", "org_name": "Intuitive Surgical"},
        {"ticker": "REGN", "org_name": "Regeneron Pharmaceuticals"},
        {"ticker": "PYPL", "org_name": "PayPal Holdings"},
        {"ticker": "VRTX", "org_name": "Vertex Pharmaceuticals "},
        {"ticker": "FISV", "org_name": "Fiserv"},
        {"ticker": "LRCX", "org_name": "Lam Research Corp"},
        {"ticker": "ATVI", "org_name": "Activision Blizzard"},
        {"ticker": "MU", "org_name": "Micron Technology"},
        {"ticker": "MELI", "org_name": "MercadoLibre"},
        {"ticker": "CSX", "org_name": "CSX Corp"},
        {"ticker": "PANW", "org_name": "Palo Alto Networks"},
        {"ticker": "MRNA", "org_name": "Moderna "},
        {"ticker": "SNPS", "org_name": "Synopsys "},
        {"ticker": "ASML", "org_name": "ASML Holding NV"},
        {"ticker": "CDNS", "org_name": "Cadence Design Systems"},
        {"ticker": "CHTR", "org_name": "Charter Communications"},
        {"ticker": "KLAC", "org_name": "KLA Corp"},
        {"ticker": "ORLY", "org_name": "O'Reilly Automotive"},
        {"ticker": "FTNT", "org_name": "Fortinet"},
        {"ticker": "KDP", "org_name": "Keurig Dr Pepper"},
        {"ticker": "MAR", "org_name": "Marriott International MD"},
        {"ticker": "ABNB", "org_name": "Airbnb "},
        {"ticker": "KHC", "org_name": "Kraft Heinz Co/The"},
        {"ticker": "AEP", "org_name": "American Electric Power Co"},
        {"ticker": "NXPI", "org_name": "NXP Semiconductors NV"},
        {"ticker": "DXCM", "org_name": "Dexcom"},
        {"ticker": "CTAS", "org_name": "Cintas Corp"},
        {"ticker": "ADSK", "org_name": "Autodesk"},
        {"ticker": "PDD", "org_name": "PDD Holdings ADR"},
        {"ticker": "MCHP", "org_name": "Microchip Technology"},
        {"ticker": "AZN", "org_name": "AstraZeneca PLC ADR"},
        {"ticker": "IDXX", "org_name": "IDEXX Laboratories"},
        {"ticker": "EXC", "org_name": "Exelon Corp"},
        {"ticker": "PAYX", "org_name": "Paychex"},
        {"ticker": "BIIB", "org_name": "Biogen"},
        {"ticker": "LULU", "org_name": "Lululemon Athletica"},
        {"ticker": "WDAY", "org_name": "Workday"},
        {"ticker": "SGEN", "org_name": "Seagen"},
        {"ticker": "PCAR", "org_name": "PACCAR"},
        {"ticker": "GFS", "org_name": "GLOBALFOUNDRIES"},
        {"ticker": "ODFL", "org_name": "Old Dominion Freight Line"},
        {"ticker": "XEL",  "org_name": "Xcel Energy"},
        {"ticker": "MRVL", "org_name": "Marvell Technology"},
        {"ticker": "WBD", "org_name": "Warner Bros Discovery"},
        {"ticker": "CPRT", "org_name": "Copart"},
        {"ticker": "ROST", "org_name": "Ross Stores"},
        {"ticker": "ILMN", "org_name": "Illumina"},
        {"ticker": "EA", "org_name": "Electronic Arts"},
        {"ticker": "DLTR", "org_name": "Dollar Tree"},
        {"ticker": "CTSH", "org_name": "Cognizant Technology Solutions Corp"},
        {"ticker": "FAST", "org_name": "Fastenal Co"},
        {"ticker": "CRWD", "org_name": "Crowdstrike Holdings"},
        {"ticker": "VRSK", "org_name": "Verisk Analytics"},
        {"ticker": "WBA", "org_name": "Walgreens Boots Alliance"},
        {"ticker": "CSGP", "org_name": "CoStar Group"},
        {"ticker": "ANSS", "org_name": "ANSYS"},
        {"ticker": "BKR", "org_name": "Baker Hughes Co"},
        {"ticker": "MNST", "org_name": "Monster Beverage Corp"},
        {"ticker": "ENPH", "org_name": "Enphase Energy"},
        {"ticker": "CEG", "org_name": "Constellation Energy Corp"},
        {"ticker": "FANG", "org_name": "Diamondback Energy"},
        {"ticker": "ALGN", "org_name": "Align Technology"},
        {"ticker": "TEAM", "org_name": "Atlassian Corp"},
        {"ticker": "EBAY","org_name":  "eBay"},
        {"ticker": "DDOG", "org_name": "Datadog"},
        {"ticker": "JD", "org_name": "JD.com  ADR"},
        {"ticker": "ZM", "org_name": "Zoom Video Communications"},
        {"ticker": "ZS", "org_name": "Zscaler"},
        {"ticker": "LCID", "org_name": "Lucid Group"},
        {"ticker": "SIRI", "org_name": "Sirius XM Holdings"},
        {"ticker": "RIVN", "org_name": "Rivian Automotive"}
        ]

    stocks_data2 = []

    for stock in stocks_data:
        value = Stock(ticker=stock['ticker'], org_name=stock['org_name'])
        stocks_data2.append(value)


    # Add the watchlists to the database
    db.session.add_all(stocks_data2)
    db.session.commit()


def undo_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM stocks"))

    db.session.commit()
