/* 
Attendre le chargement du DOM
*/
document.addEventListener('DOMContentLoaded', () => {

    // Déclaration des constantes/variables du DOM

    const buttonDisconnect = document.querySelector('#disconnect');
    const profilButton = document.querySelector('#profilButton');
    const favoriteButton = document.querySelector('#favoriteButton');
    const localSt = 'user';

    const register = document.querySelector('#register');
    const login = document.querySelector('#login');

    const registerForm = document.querySelector('#registerForm');
    const email = document.querySelector('#email');
    const password = document.querySelector('#password');
    const name = document.querySelector('#name');

    const showCreation = document.querySelector('#showCreation');
    const workout = document.querySelector('#workout');
    const workoutForm = document.querySelector('#workoutForm');
    const titleWorkout = document.querySelector('#titleWorkout');
    const descriptionWorkout = document.querySelector('#descriptionWorkout');
    const goalWorkout = document.querySelector('#goalWorkout');
    const durationWorkout = document.querySelector('#durationWorkout');
    const muscleWorkout = document.querySelector('#muscleWorkout');
    const equipementWorkout = document.querySelector('#equipementWorkout');
    const seriesWorkout = document.querySelector('#seriesWorkout');
    const exerciseWorkout = document.querySelector('#exerciseWorkout');

    const search = document.querySelector('#search');
    const searchForm = document.querySelector('#searchForm');
    const searchData = document.querySelector('#searchData');
    const searchType = document.querySelector('#searchType');
    
    const workoutMoment = document.querySelector('.workoutMoment');
    const listWorkout = document.querySelector('#listWorkout');
    
    const loginForm = document.querySelector('#loginForm');
    const emailLogin = document.querySelector('#emailLogin');
    const passwordLogin = document.querySelector('#passwordLogin');

    const hiStranger = document.querySelector('#hiStranger')
    const notificationMessage = document.querySelector('#notification');
    const profil = document.querySelector('#profil');
    const welcome = document.querySelector('#welcome');
    const listFavorites = document.querySelector('#listFavorites');

    const url = "http://localhost:6985";

    var count = 0;
    var count2 = 0;
    
    const getHomeSubmit = () => {

        if(welcome == null) {

            registerForm.addEventListener('submit', event => {
                // Stop event propagation
                event.preventDefault();

                // Check form data
                let formError = 0;

                if(name.value.length < 3) { formError++ };
                if(email.value.length < 5) { formError++ };
                if(password.value.length < 3) { formError++ };

                if(formError === 0){
                    new requestAPI(`/api/auth/register`, 'POST', { 
                        name: name.value,
                        email: email.value,
                        password: password.value
                    })
                    .callAPI()
                    .then( fetchData => {
                        console.log(fetchData)
                        notification("Vous vous êtes bien enregistré !");
                        register.classList.add('hidden');
                    })
                    .catch( fetchError => {
                        console.log(fetchError.message)
                    });
                }
                else{ displayError('Check mandatory fields') }
            });

            loginForm.addEventListener('submit', (event) => {
                console.log("HEYYYYYYYYYYYYYYYYYYYYY");
                isLogin = 0;
                event.preventDefault();
                emailVar = emailLogin.value ;
                passwordVar = passwordLogin.value ;
        
                if (emailVar !== null && passwordVar !== null) {
                    
                    new requestAPI('/api/auth/login', 'POST', {
                        email: emailVar,
                        password: passwordVar
                    })
                    .callAPI()
                    .then( fetchData => {
                        localStorage.setItem(localSt, fetchData.token);
                        console.log(fetchData.token);
                        checkToken('checkuser');
                        document.location.href = '/'
                    })
                    .catch(error=>{
                        console.log(error.message)
                    })   
                } else {
                    console.log('erreur à la connection')
                }
                // loginForm.reset();
            })
        };
    }

    const checkToken = (step = 'checkuser') => {
        new requestAPI(
            `${url}/api/auth/me`,
            'POST', {
                token: localStorage.getItem(localSt)
            }
        )
        .callAPI()
        .then( fetchData => {
            // Check step
            if( step === 'favorite' ){ // Add favorite
                // Display favorites
                // displayFav(fetchData)
            }
            else if( step === 'checkuser' ){ // First check
                console.log(fetchData)
                console.log("WE FOOCKING DID")
                
                buttonDisconnect.style.display = "initial";
                favoriteButton.style.display = "initial";
                profilButton.style.display = "initial";

                // Hide register and loggin form
                if(profil != null) {
                    getWorkouts(fetchData.data._id)
                    getHomeSubmit();
                }

                else if(listFavorites != null) {
                    getFavorites(fetchData.data._id)
                }
                
                else {
                    register.classList.add('hidden');
                    login.classList.add('hidden');
                    search.style.display = "block";
                    showCreation.style.display = "flex";
                    workoutMoment.style.display = "block";

                    getExercises(exerciseWorkout);
                    toggleDiv(showCreation, workout);
                    workoutCreation(fetchData.data._id);
                    searchWorkout(fetchData.data._id);
                    getAllWorkouts(fetchData.data._id);
                }
            }
        })
        .catch( fetchError => {
            console.log("DAMN BROSKY")
            console.log(fetchError)
        })
    }

    const logOut = () => {
        buttonDisconnect.addEventListener('click', () => {
            if( localStorage.getItem(localSt) !== null ){
                localStorage.removeItem(localSt) ;
                buttonDisconnect.style.display = "none";
                document.location.href = '/'
            }
                
        })
    }

    const notification = (message) => {
        notificationMessage.innerHTML = `${message}`;
    }

    const selectExercises = (exercises, element) => {
        element.innerHTML = `Choisissez votre exercice !`;
        exercises.forEach(exercise => {
            element.innerHTML += `<option value="${exercise._id}">${exercise.title}</option>`
        })
    }
    
    const workoutCreation = (userId) => {
        workoutForm.addEventListener('submit', event => {  
            // Stop event propagation
            event.preventDefault();

            const exerciseIdentity = document.getElementsByClassName('exercise-identity');
            const exerciseNumber = document.getElementsByClassName('exercise-number');

            var arrayExercise = Array.from(exerciseIdentity);
            var arrayHowMany = Array.from(exerciseNumber);

            var arrayExerciseID = []
            var arrayHowManyFinal = []
    
            arrayExercise.forEach(element => arrayExerciseID.push(element.className.split(" ")[0]));
            arrayHowMany.forEach(element => 
                arrayHowManyFinal.push(element.value)
            );
    
            console.log(arrayExerciseID)
            console.log(arrayHowManyFinal)

            new requestAPI(`/api/workout/create`, 'POST', { 
                title: titleWorkout.value,
                description: descriptionWorkout.value,
                goal: goalWorkout.value,
                duration: durationWorkout.value,
                muscle: muscleWorkout.value,
                equipement: equipementWorkout.value,
                nbSerie: seriesWorkout.value,
                exercises: { exercise: arrayExerciseID, howMany: arrayHowManyFinal },
                creator: userId
            })
            .callAPI()
            .then( fetchData => {
                console.log(fetchData)
                document.location.href = './pages/profil.html'
            })
            .catch( fetchError => {
                console.log(fetchError.message)
            });
        });
    }

    async function getExercises(element) {
        new requestAPI(`/api/exercise/find/all`, 'GET', { 
        })
        .callAPI()
        .then( fetchData => {
            console.log(fetchData)
            selectExercises(fetchData.data, element)
            getExercise(element)
        })
        .catch( fetchError => {
            console.log(fetchError.message)
        });
    }

    function oneExerciseName(idExercise, exercises) {
        exercises.forEach(exercise => {
            if(idExercise == exercise._id) {
                return exercise.title;
            }
        })
    }
    
    async function getExercise(element) {
        element.addEventListener("change", function(e) {
            new requestAPI(`/api/exercise/find/${e.target.value}`, 'GET', { 
            })
            .callAPI()
            .then( fetchData => {
                console.log(fetchData)
                console.log(fetchData.title)
                addExerciseToWorkout(fetchData.data, null)
            })
            .catch( fetchError => {
                console.log(fetchError.message)
            });
        })
    }

    Element.prototype.remove = function() {
        console.log("BAH CEST COMMENT ?????");
        this.parentElement.removeChild(this);
    }

    function deleteContent(element) {
        element.remove();
    }

    const addExerciseToWorkout = (exercise, howMany) => {
        count++;
        var creation = document.getElementById("nbRepetition");
        creation.innerHTML+= '';

        var content = document.createElement("div");
        var imageExercise = document.createElement("img");
        var labelExercise = document.createElement("label");
        var inputText = document.createElement("input");
        var inputNumber = document.createElement("input");
        var containerForm = document.createElement("div");

        content.setAttribute("id", `content_${count}`);
        content.setAttribute("class", `container-div`);

        imageExercise.setAttribute("src", `${exercise.image}`);
        imageExercise.setAttribute("class", "creationImage");

        labelExercise.innerHTML = `${exercise.title}`

        inputText.setAttribute("name","exercise");
        inputText.setAttribute("class",`${exercise._id} exercise-identity`);
        inputText.setAttribute("value",`${exercise._id}`);
        inputText.setAttribute("type","hidden");

        inputNumber.setAttribute("class",`${exercise._id} exercise-number form-control`);
        inputNumber.setAttribute("name",`${exercise.title}`);
        if(howMany != null) {
            inputNumber.setAttribute("value", howMany);
        }
        inputNumber.setAttribute("type","number");

        containerForm.setAttribute("class", `container-form`);
        
        content.appendChild(imageExercise);
        content.appendChild(inputText);
        content.appendChild(inputNumber);
        containerForm.appendChild(labelExercise);
        content.appendChild(containerForm);

        containerForm.innerHTML += `<button type="button" id="delete_${count}" class="btn btn-danger deleteExercise">X</button>`
        creation.appendChild(content);

        document.addEventListener('click', function (event) {
            if (event.target.matches('.deleteExercise')) {
                if(event.target.parentElement.parentElement.parentElement != null) {
                    deleteContent(event.target.parentElement.parentElement)
                }  
            }
        }, false);
        
        const exerciseIdentity = document.getElementsByClassName('exercise-identity');
        const exerciseNumber = document.getElementsByClassName('exercise-number');
    
    }

    const getExerciseById = (idExercise, howMany, element, workoutId, update) => {
        new requestAPI(`/api/exercise/find/${idExercise}`, 'GET', { 
        })
        .callAPI()
        .then( fetchData => {
            if(update == 0) {
                displayExercise(fetchData.data, howMany, element, workoutId)
            }
            else {
                addExerciseToWorkout(fetchData.data, howMany)
            }
        })
        .catch( fetchError => {
            console.log(fetchError.message)
        });
    }

    const displayExercise = (exercise, howMany, element, workoutId) => {
        if(exercise != null) {
            element.innerHTML += 
            `<td class="repetitionDisplay_${workoutId}_${count2} exercise-container"><img src="${exercise.image}" alt="${exercise.title}"><p class="repetitionNumber_${workoutId}_${count2}"></p><p>${exercise.title}</p></td>`
        }
        
        var repetitionContainer = null
        var repetitionContainer = document.querySelector(`.repetitionDisplay_${workoutId}_${count2}`);
        var repetitionNumber = null;
        var repetitionNumber = document.querySelector(`.repetitionNumber_${workoutId}_${count2}`);

        if(repetitionContainer == null) {
            console.log("TESTOOOOOOOOO")
        }

        repetitionNumber.innerHTML += ` x${howMany}`
        count2++
    }

    const displayWorkouts = (workouts) => {
        workouts.forEach(workout => {
            profil.innerHTML += 
                `<div class="workoutContainer">
                    <table class="table_${workout._id}">
                        <thead>
                            <tr>
                                <th colspan="2" class="favAbsolute">${workout.title} <form id="form_${workout._id}"><input type="hidden" name="idWorkout" id="idWorkout_${workout._id}" value="${workout._id}" /><button type="submit" id="updateWorkout_${workout._id}" class="btn btn-primary buttonUpdate">Modifier</button></form></th>
                            </tr>
                            <tr>
                                <th colspan="2" class="numberFavorite"><span class="favoriteAmount">${workout.nbFavorite}</span> favoris</th>
                            </tr>
                        </thead>
                         <tbody>
                                <tr>
                                    <td colspan="2">${workout.description}</td>
                                </tr>
                                <tr class="row-tr">
                                    <td><i class="fas fa-bullseye"></i> ${workout.goal}</td>
                                    <td><i class="fas fa-fist-raised"></i> ${workout.muscle}</td>
                                </tr>
                                <tr class="row-tr">
                                    <td><i class="fas fa-dumbbell"></i> ${workout.equipement}</td>
                                    <td><i class="fas fa-hourglass-start"></i>${workout.duration}</td>
                                </tr>
                                <tr>
                                    <td class="titleExercise">Résumé</td>
                                </tr>
                                <tr id="exercisesDisplay_${workout._id}">
                                </tr>
                                <tr>
                                    <td class="numberSerie">Série x${workout.nbSerie}</td>
                                </tr>
                                <tr>
                                    <td><button type="submit" id="deleteWorkout_${workout._id}" class="btn btn-danger buttonDelete">Supprimer</button></td>
                                </tr>
                            </tbody>
                        <div></div>
                    </table>
                </div>`    
        })

        workouts.forEach(workout => {
            console.log(document.getElementById("exercisesDisplay_5ee200a4a78b1b4fdc93aa8f"))
            var exercisesDisplay = document.querySelector(`#exercisesDisplay_${workout._id}`)
            var formWorkout = document.querySelector(`#form_${workout._id}`)
            var idWorkout = document.querySelector(`#idWorkout_${workout._id}`)
            var tableContainer = document.querySelector(`.table_${workout._id}`)
            var deleteButton = document.querySelector(`#deleteWorkout_${workout._id}`)
            var workoutId = workout._id

            workout.exercises.forEach(element => {
                for(i=0 ; i < element.exercise.length ; i++) {
                    getExerciseById(element.exercise[i], element.howMany[i], exercisesDisplay, workoutId, 0)
                }
            })

            formWorkout.addEventListener('submit', event => {
                event.preventDefault();
                console.log(idWorkout.value)
                tableContainer.innerHTML = 
                `<form id="formUpdate" action="#">
                    <thead>
                        <tr>
                            <th colspan="2"><label for="titleWorkout"><i class="fas fa-signature"></i> Nom</label></th>
                            <th colspan="2"><input type="text" name="titleUpdate" id="titleUpdate" value="${workout.title}" class="form-control"/></th>
                        </tr>
                    </thead>
                    <tbody class="updateTable">
                        <tr>
                            <td colspan="2"><label for="descriptionUpdate"><i class="far fa-bookmark"></i> Description</label></td>
                            <td colspan="2"><input type="text" name="descriptionUpdate" id="descriptionUpdate" value="${workout.description}" class="form-control"/></td>
                        </tr>
                        <tr>
                            <td colspan="2"><label for="goalWorkout"><i class="fas fa-bullseye"></i> But du workout</label></td>
                            <td><input type="text" name="goalUpdate" id="goalUpdate" value="${workout.goal}" class="form-control"/></td>
                            <td colspan="2"><label for="muscleWorkout"><i class="fas fa-fist-raised"></i> Muscles concernés</label></td>
                            <td><input type="text" name="muscleUpdate" id="muscleUpdate" value="${workout.muscle}" class="form-control"/></td>
                        </tr>
                        <tr>
                            <td colspan="2"> <label for="equipementWorkout"><i class="fas fa-dumbbell"></i> Equipement</label></td>
                            <td><input type="text" name="equipementUpdate" id="equipementUpdate" value="${workout.equipement}" class="form-control"/></td>
                            <td colspan="2"><label for="durationWorkout"><i class="fas fa-hourglass-start"></i> Durée moyenne</label></td>
                            <td><input type="text" name="durationUpdate" id="durationUpdate" value="${workout.duration}" class="form-control"/></td>
                        </tr>
                        <tr>
                            <td colspan="2"><label for="seriesWorkout"><i class="fas fa-sort-numeric-down"></i> Nombre de série</label></td>
                            <td><input type="text" name="seriesUpdate" id="seriesUpdate" value="${workout.nbSerie}" class="form-control"/></td>
                        </tr>
                        <tr>
                            <td colspan="2"><label for="content"><i class="fas fa-running"></i> Exercises</label></td>
                            <select name="exerciseUpdate" id="exerciseUpdate" class="form-control">
                            </select>
                            <div id="nbRepetition" class="updateTable"></div>
                        </tr>
                    </tbody>
                    <button type="submit" class="btn btn-primary buttonValidateUpdate">Enregistrer</button>
                </form>`

                const nbRepetition = document.querySelector('#nbRepetition');

                workout.exercises.forEach(element => {
                    for(i=0 ; i < element.exercise.length ; i++) {
                        getExerciseById(element.exercise[i], element.howMany[i], exercisesDisplay, workoutId, 1)
                    }
                })

                const formUpdate = document.querySelector('#formUpdate');
                const titleUpdate = document.querySelector('#titleUpdate');
                const descriptionUpdate = document.querySelector('#descriptionUpdate');
                const goalUpdate = document.querySelector('#goalUpdate');
                const durationUpdate = document.querySelector('#durationUpdate');
                const muscleUpdate = document.querySelector('#muscleUpdate');
                const equipementUpdate = document.querySelector('#equipementUpdate');
                const seriesUpdate = document.querySelector('#seriesUpdate');
                const exerciseUpdate = document.querySelector('#exerciseUpdate');
                const buttontest = document.querySelector('.buttonValidateUpdate');

                getExercises(exerciseUpdate);
                updateWorkout(workout._id, buttontest)

            });

            deleteWorkout(workout._id, deleteButton);
        })  
    }

    const getWorkouts = (userId) => {
        new requestAPI(`/api/workout/find/${userId}`, 'GET', { 
        })
        .callAPI()
        .then( fetchData => {
            console.log(fetchData)
            displayWorkouts(fetchData.data);
        })
        .catch( fetchError => {
            console.log(fetchError.message)
        });    
    }

    const getAllWorkouts = (userId) => {
        new requestAPI(`/api/workout/find/all`, 'GET', { 
        })
        .callAPI()
        .then( fetchData => {
            console.log(fetchData)
            displayListWorkouts(fetchData.data, userId);
        })
        .catch( fetchError => {
            console.log(fetchError.message)
        });    
    }

    const displayListWorkouts = (workouts, userId) => {
        listWorkout.innerHTML = ``;
        workouts.forEach(workout => {
            if(workout.creator != userId) {
                listWorkout.innerHTML += 
                    `<div class="workoutContainer">
                        <table class="table_${workout._id}">
                            <thead>
                                <tr>
                                    <th colspan="2" class="favAbsolute">${workout.title} <button id="favoriteWorkout_${workout._id}" class="btn buttonUpdate"><i class="far fa-star"></i></button></th>
                                </tr>
                                <tr>
                                    <th colspan="2" class="numberFavorite"><span class="favoriteAmount">${workout.nbFavorite}</span> favoris</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colspan="2">${workout.description}</td>
                                </tr>
                                <tr class="row-tr">
                                    <td><i class="fas fa-bullseye"></i> ${workout.goal}</td>
                                    <td><i class="fas fa-fist-raised"></i> ${workout.muscle}</td>
                                </tr>
                                <tr class="row-tr">
                                    <td><i class="fas fa-dumbbell"></i> ${workout.equipement}</td>
                                    <td><i class="fas fa-hourglass-start"></i>${workout.duration}</td>
                                </tr>
                                <tr>
                                    <td class="titleExercise">Résumé</td>
                                </tr>
                                <tr id="exercisesDisplay_${workout._id}">
                                </tr>
                                <tr>
                                    <td class="numberSerie">Série x${workout.nbSerie}</td>
                                </tr>
                            </tbody>
                            <div></div>
                        </table>
                    </div>`
            }    
        })

        workouts.forEach(workout => {
            if(workout.creator != userId) {
                console.log(document.getElementById("exercisesDisplay_5ee200a4a78b1b4fdc93aa8f"))
                var exercisesDisplay = document.querySelector(`#exercisesDisplay_${workout._id}`)
                var formWorkout = document.querySelector(`#form_${workout._id}`)
                var idWorkout = document.querySelector(`#idWorkout_${workout._id}`)
                var tableContainer = document.querySelector(`.table_${workout._id}`)
                var favoriteButton = document.querySelector(`#favoriteWorkout_${workout._id}`)
                var workoutId = workout._id

                workout.exercises.forEach(element => {
                    for(i=0 ; i < element.exercise.length ; i++) {
                        getExerciseById(element.exercise[i], element.howMany[i], exercisesDisplay, workoutId, 0)
                    }
                })

                newFavorite(workoutId, userId, favoriteButton)
                findOneFavorite(userId, workoutId, favoriteButton)
            }
        })
    }

    const updateWorkout = (workoutId, element) => { 
        element.addEventListener('click', event => {
            console.log(element)
            const exerciseIdentity = document.getElementsByClassName('exercise-identity');
            const exerciseNumber = document.getElementsByClassName('exercise-number');

            var arrayExercise = Array.from(exerciseIdentity);
            var arrayHowMany = Array.from(exerciseNumber);

            var arrayExerciseID = []
            var arrayHowManyFinal = []

            arrayExercise.forEach(element => arrayExerciseID.push(element.className.split(" ")[0]));
            arrayHowMany.forEach(element => 
                arrayHowManyFinal.push(element.value)
            );

            console.log(arrayExerciseID)
            console.log(arrayHowManyFinal)
            console.log("test");
            console.log(seriesUpdate.value);
            new requestAPI(`/api/workout/update/${workoutId}`, 'PUT', {
                title: titleUpdate.value,
                description: descriptionUpdate.value,
                goal: goalUpdate.value,
                duration: durationUpdate.value,
                muscle: muscleUpdate.value,
                equipement: equipementUpdate.value,
                nbSerie: seriesUpdate.value,
                exercises: { exercise: arrayExerciseID, howMany: arrayHowManyFinal },
            })
            .callAPI()
            .then( fetchData => {
                console.log("You did it you bastard")
                console.log(fetchData)
                document.location.href = './profil.html'
            })
            .catch(error=>{
                console.log(error.message)
            })   
        })  
    }

    const deleteWorkout = (workoutId, element) => {
        if(element != null) {
            element.addEventListener('click', event => {
                new requestAPI(`/api/workout/delete/${workoutId}`, 'DELETE', {
                })
                .callAPI()
                .then( fetchData => {
                    console.log("You deleted it... Are you insane ?")
                    console.log(fetchData)
                })
                .catch(error=>{
                    console.log(error.message)
                })   
            })  
        }
    }

    const newFavorite = (workoutId, userId, element) => {
        element.addEventListener('click', event => {
            console.log(workoutId)
            console.log(userId)
            console.log(element)
            new requestAPI(`/api/favorite/create`, 'POST', {
                workout: workoutId,
                user: userId
            })
            .callAPI()
            .then( fetchData => {
                console.log("You nicely added a favorite workout :)")
                console.log(fetchData)
                changeButtonFavoriteAsynchrone(element);
                getNumberFavorites(fetchData.data.workout, 1);
            })
            .catch(error=>{
                console.log(error.message)
            })   
        })  
    }

    const changeNumberFavorite = (workoutId, nbFavorite, change) => {
        console.log("tzesttt")
        console.log(nbFavorite)
        new requestAPI(`/api/workout/update/favorite/${workoutId}`, 'PUT', {
            nbFavorite: nbFavorite+change,
        })
        .callAPI()
        .then( fetchData => {
            console.log("You add +1 to the number of favorite")
            console.log(fetchData)
        })
        .catch(error=>{
            console.log(error.message)
        })    
    }

    const getNumberFavorites = (workoutId, change) => {
        new requestAPI(`/api/workout/find/id/${workoutId}`, 'GET', {
        })
        .callAPI()
        .then( fetchData => {
            if(change == 1) {
                console.log("You add +1 to the number of favorite")
            }
            else {
                console.log("You did -1 to the number of favorite")
            }
            console.log(fetchData)
            changeNumberFavorite(workoutId, fetchData.data[0].nbFavorite, change)
        })
        .catch(error=>{
            console.log(error.message)
        })    
    }


    const findOneFavorite = (userId, workoutId, element) => {
        new requestAPI(`/api/favorite/find/${userId}/${workoutId}`, 'GET', {
        })
        .callAPI()
        .then( fetchData => {
            console.log(fetchData)
            changeButtonFavorite(fetchData.data, element);
        })
        .catch(error=>{
            console.log(error.message)
        })   
    }

    const getFavorites = (userId) => {
        new requestAPI(`/api/favorite/find/${userId}`, 'GET', {
        })
        .callAPI()
        .then( fetchData => {
            console.log(fetchData);
            displayFavorites(fetchData.data, userId)
        })
        .catch(error=>{
            console.log(error.message)
        })   
    }

    const deleteFavorite = (favoriteId, element, container) => {
        if(element != null) {
            element.addEventListener('click', event => {
                new requestAPI(`/api/favorite/delete/${favoriteId}`, 'DELETE', {
                })
                .callAPI()
                .then( fetchData => {
                    console.log("You deleted it... Good job !")
                    console.log(fetchData)
                    getNumberFavorites(fetchData.data.workout, -1);
                    container.classList.add('hidden');
                })
                .catch(error=>{
                    console.log(error.message)
                })   
            })  
        }
    }

    const changeButtonFavorite = (isFavorite, element) => {
        if(isFavorite != "") {
            element.innerHTML = `<i class="fas fa-star"></i>`;
            element.disabled = "true";
        }
    }

    const changeButtonFavoriteAsynchrone = (element) => {
        element.innerHTML = `<i class="fas fa-star"></i>`;
        element.disabled = "true";
    }

    const displayFavorites = (favorites, userId) => {
        favorites.forEach(favorite => {
            listFavorites.innerHTML += 
                `<div id="favorite_${favorite._id}" class="workoutContainer">
                    <table class="table_${favorite.workout._id}">
                        <thead>
                            <tr>
                                <th colspan="2" class="favAbsolute">${favorite.workout.title}</th>
                            </tr>
                            <tr>
                                <th colspan="2" class="numberFavorite"><span class="favoriteAmount">${favorite.workout.nbFavorite}</span> favoris</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="2">${favorite.workout.description}</td>
                            </tr>
                            <tr class="row-tr">
                                <td><i class="fas fa-bullseye"></i> ${favorite.workout.goal}</td>
                                <td><i class="fas fa-fist-raised"></i> ${favorite.workout.muscle}</td>
                            </tr>
                            <tr class="row-tr">
                                <td><i class="fas fa-dumbbell"></i> ${favorite.workout.equipement}</td>
                                <td><i class="fas fa-hourglass-start"></i>${favorite.workout.duration}</td>
                            </tr>
                            <tr>
                                <td class="titleExercise">Résumé</td>
                            </tr>
                            <tr id="exercisesDisplay_${favorite.workout._id}">
                            </tr>
                            <tr>
                                <td class="numberSerie">Série x${favorite.workout.nbSerie}</td>
                            </tr>
                            <tr>
                                <td><button type="submit" id="deleteFavorite_${favorite._id}" class="btn btn-danger buttonDeleteFavorite">Supprimer des favoris</button></td>
                            </tr>
                        </tbody>
                        <div></div>
                    </table>
                </div>`   
        })

        favorites.forEach(favorite => {
            console.log(document.getElementById("exercisesDisplay_5ee200a4a78b1b4fdc93aa8f"))
            var exercisesDisplay = document.querySelector(`#exercisesDisplay_${favorite.workout._id}`)
            var workoutId = favorite.workout._id
            var favoriteId = favorite._id;
            var favoriteContainer = document.querySelector(`#favorite_${favorite._id}`)
            var deleteButtonFavorite = document.querySelector(`#deleteFavorite_${favorite._id}`)

            deleteFavorite(favoriteId, deleteButtonFavorite, favoriteContainer)

            favorite.workout.exercises.forEach(element => {
                for(i=0 ; i < element.exercise.length ; i++) {
                    getExerciseById(element.exercise[i], element.howMany[i], exercisesDisplay, workoutId, 0)
                }
            })  
        })
    }

    async function searchWorkout(userId) {
        searchForm.addEventListener('submit', event => {
            event.preventDefault();
            var keyword = searchData.value;
            var searchSection = searchType.value;

            new requestAPI(`/api/workout/find/${searchSection}/${keyword}`, 'GET', {
            })
            .callAPI()
            .then( fetchData => {
                console.log(fetchData)
                displayListWorkouts(fetchData.data, userId);
                workoutMoment.innerHTML = `Résultats de la recherche :`;
            })
            
            .catch(error=>{
                console.log(error.message)
            })
        })
    }

    const displayCreation = () => {
        buttonDisconnect.addEventListener('click', () => {
            var x = document.getElementById("myDIV");
            if (x.style.display === "none") {
              x.style.display = "block";
            } else {
              x.style.display = "none";
            }
        })
    }

    function toggleDiv(elementClick, elementToggle) {
        elementClick.addEventListener('click', () => {
            if (elementToggle.style.display === "none") {
                elementToggle.style.display = "flex";
            } else {
                elementToggle.style.display = "none";
            }
        })
    }

    if( localStorage.getItem(localSt) !== null ){
        console.log(localStorage.getItem(localSt))
        // Get user onnfoprmations
        checkToken('checkuser');
    }

    else{
        getHomeSubmit();
    };

    logOut();

})
