import pandas as pd
from datetime import datetime

def process_data(data):
    df = pd.DataFrame(data)
    df['request_time'] = datetime.now()
    df =df.astype(str)
    return df
