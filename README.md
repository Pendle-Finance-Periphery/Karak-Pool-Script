## Introduction

This sentio indexer aims to take a snapshot of Pendle users before a specific timestamp everyday. 
For timestamp configuration, it can be done in `./src/consts.ts`.

## Usage

Users' data at a specific block (statisfying the configuration) can be fetched/viewed in `Data Studio` with a simple SQL queries.



- Get user data of some block
```sql
select user, max(share) as share from `UserDailyShare` where recordedAtBlock = 20012347 group by user
```


Get latest block which the data studio has updated (attached with 4PM UTC timestamp):

```sql
select max(recordedAtBlock) as recordedAtBlock from `DailyUpdateBlock`
```
