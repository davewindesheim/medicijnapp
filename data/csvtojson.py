import csv
import json
import requests
from io import StringIO

csv_url = 'https://www.geneesmiddeleninformatiebank.nl/metadata.csv'
json_file_path = '../assets/data.json'

keys_to_remove = ['POTENTIE', 'PROCEDURENUMMER', 'AANVULLENDEMONITORING', 'PAR_FILENAAM', 'SPAR_FILENAAM', 'ARM_FILENAAM', 'ARMM_FILENAAM', 'NIEUWS_LINKS', 'NIEUWS_LINKS_DATUM', 'NIEUWS_LINK_DATUMS']

response = requests.get(csv_url)
if response.status_code == 200:
    csv_content = StringIO(response.text)

    csv_data = []
    csv_reader = csv.DictReader(csv_content, delimiter='|')

    for row in csv_reader:
        for key in keys_to_remove:
            row.pop(key, None)
        csv_data.append(row)

    with open(json_file_path, 'w', encoding='utf-8') as jsonfile:
        jsonfile.write(json.dumps(csv_data, indent=2))

    print(f"Downloaded latest data, JSON file saved to {json_file_path}")
else:
    print(f"Failed to download CSV file. Status code: {response.status_code}")