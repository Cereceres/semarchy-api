# semarchy-api
semarchy client for nodejs

# usage

```js
const host = process.env.HOST
const user = process.env.USER
const pass = process.env.PASS
const Semarchy = require('semarchy-api')
const sem = Semarchy(host, user, pass)
async()=>{
    const {
            loadId,
            loadStatus,
            loadCreator,
            loadCreationDate,
            programName,
            loadDescription,
            numberOfJobExecutions,
            submitInterval,
            submittable
        } = await sem.createLoad({ 
        programName: 'yourProgrameName', 
        loadDescription: 'your description', 
        dataLocation: 'yourDataLocation'
    })

    await sem.uploadData({ 
        persistOptions:{}, 
        persistRecords: {},
        dataLocation: 'dataLocation'
    })

    await sem.submitLoad({ 
        jobName: 'yourJobName', 
        dataLocation: 'yourDataLocation'
    })
}

```

# API

# Class Semarchy(host=process.env.HOST, user=process.env.USER, pass=process.env.PASS)

# Methods

## createLoad({ programName, loadDescription = '', dataLocation })
## getLoad({ dataLocation, loadId=this.loadId })
## uploadData({ persistOptions, persistRecords, dataLocation, loadId=this.loadId })
## cancelLoad({ dataLocation, loadId=this.loadId })
## submitData({ jobName, dataLocation, loadId=this.loadId })
## get({ id, dataLocation, entity, typeView = 'GD' })
## query({ nameQuery, dataLocation, typeView, query :qs })

# Properties

## load

Is set when createLoad is called

## host
## user
## pass



