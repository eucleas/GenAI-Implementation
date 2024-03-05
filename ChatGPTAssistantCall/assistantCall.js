const { OpenAI } = require("openai");
const { sleep } = require("openai/core");
const colors = require('colors');


const openai = new OpenAI();

async function main() {
const assistant = await openai.beta.assistants.retrieve('asst_lz427nbD82LylsyEeLaoQyKS');

//Create Thread
const thread = await openai.beta.threads.create();
console.log(thread.id);

//Create Message
const message = await openai.beta.threads.messages.create(thread.id,
    {
        role:"user",
        content:"Dubai"
    });

//Create run.id to send the message to the assistant
    const run = await openai.beta.threads.runs.create(thread.id,
        {
            assistant_id:assistant.id,
            model:"gpt-3.5-turbo"
        } );
console.log(run.id);


//Retrieve a Reply from Assistant 
let status="inital"
let result
while(status!=='completed'){
    result=await openai.beta.threads.runs.retrieve(thread.id,run.id);
    status=result.status;
    sleep(5000)
}
//Show the last Message
const messages = await openai.beta.threads.messages.list(thread.id, {
    limit: 1
  });

  messages.body.data.forEach(message => {
    console.log(colors.green(`${message.role}: ${message.content[0].text.value}`))
  })


}
main();