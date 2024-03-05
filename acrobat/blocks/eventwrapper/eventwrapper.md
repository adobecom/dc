# Event Wrapper

Allows for content variation depeding on whcih events the DC Widget emits. The accepted arguments are in the order in which they are emitted (download/cancel are only actvie if user does so): 
- `start`
- `upload`
- `uploadcomplete`
- `conversion`
- `complete`
- `preview`
- `download`
- `cancel`

## Block Configuration 

| Eventwrapper (`argument`)|
|--------------------------|
| Fragment or content      |

*Note: Several fragments can be stacked in the same cell..*

## Debug 
Use the following URL query to see all Event Wrapper blocks on a page `eventsAll`. They will be highlighted in shardes of blue.
