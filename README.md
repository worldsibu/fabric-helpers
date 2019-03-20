# forma-fabric-helpers

Some utils to perform common tasks.

```bash
npm install
```

## A. Enroll an user

### 1. Create a Service Account/Identity

* [Create a Service Account/Identity](https://docs.worldsibu.com/article/66-create-a-service-account-identity).
* [Get a Network Profile](https://docs.worldsibu.com/article/66-create-a-service-account-identity#network-profile)
* Copy the network profile and pasxxte in `./config`
* Replace properties: `client.credentialStore.path` and `client.credentialStore.cryptoStore.path` with `./config`

### 2. Configure this project

Go to `.env` and replace the values with your environment:

```bash
# Your environment's IP and port
CA_ADDRESS=https://<ip>:<port>
# Where you store/output the keys
KEYSTORE=./config
# The network profile for your network
NETWORKPROFILE=./config/networkprofile.yaml
CHANNEL=public
USERNAME=testuser
```

#### Get the `CA_ADDRESS` values

Go to your Network's Node Env

![Nodes Environment](images/nodeenv.png?raw=true "Nodes Environment")

![Find Address and port for ICA](images/addresses.png?raw=true "Find Address and port for ICA")

### 3. Enroll the user

Then call the enroll:

```bash
# The <organization-name> can be found in your network profile in `client.organization` or in the second image above in your Nodes Environment.
$ npm run enroll -- <username> <password> <organization-name>
```

### 4. Use the cryptographic material generated

You can now copy and save these values where you need them to connect to the network.

## B. Dummy invoke

Be sure you first complete the user enrollment step (A.).

Call:

```bash
npm run invoke -- <chaincodename> init
```

---

More information on [Forma DOCS](https://docs.worldsibu.com/forma).