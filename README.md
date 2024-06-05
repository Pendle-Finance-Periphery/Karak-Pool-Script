## Introduction

This sentio indexer aims to take a snapshot of Pendle users before a specific timestamp everyday. 
For timestamp configuration, it can be done in `./src/consts.ts`.

## Usage

Users' data at a specific block (statisfying the configuration) can be fetched/viewed in `Data Studio` with a simple SQL query. 

```sql
select user, share,  block_number  from `UserDailyShare` where  block_number = <BLOCK_NUMBER>
```
