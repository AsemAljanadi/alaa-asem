
let deleteElement = document.querySelector('#deleteBtn');
let cancelElement = document.querySelector('#cancelBtn');

function deleteHandler(e){
    document.querySelector('.container').classList.add('blur');
    document.querySelector('.Delete-div').style.marginTop = '-100px';
    Q_id = e.dataset.myid;
    try{
        document.querySelector('#deleteSure').setAttribute('href',`/my-questions/del/${Q_id}`);
    }
    catch {
        
    }
    try{
        document.querySelector('#deleteSureFromAll').setAttribute('href',`/all-questions/del/${Q_id}`);
    }
    catch{
        
    }
}


cancelElement.addEventListener('click', ()=>{
    document.querySelector('.container').classList.remove('blur');
    document.querySelector('.Delete-div').style.marginTop = '-1000px';

});