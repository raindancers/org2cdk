import boto3
import os
import json
from github import Github

codestar_client = boto3.client('codestar-connections')
organizations = boto3.client('organizations')

def lambda_handler(event, context):
    # Get the newly created account ID from the event
    
    paginator = organizations.get_paginator('list_accounts')
    page_iterator = paginator.paginate()
    for account in page_iterator:
        print(account)

    # get a github token and checkout the repo
    connection_token = codestar_client.get_connection(connectionArn=os.environ['CODESTAR_CONNECTION_ARN')['Connection']['ConnectionCredentials']['AccessToken']
    github = Github(connection_token)
    repo = github.get_repo(os.environ['GITHUB_REPO'])
    repo_dir = '/tmp/repo' # this is the local repo
    repo.create_using_connection(connection_token, repo_dir)


    # Update the accounts.ts file
    file_path = f'{repo_dir}/accounts.ts'
    
    
    file_content = "export enum Accounts {\n"
    for account in page_iterator:
        file_content += f"  {account['Name']} = '{account['Id']}',\n"
    file_content += "}"
    
    with open(file_path, 'w') as file:
        file.write(updated_content)

    # Push the changes to GitHub
    git = repo.get_git_ref('heads/main')
    commit = repo.get_commit(git.object.sha)
    tree = repo.get_git_tree(commit.tree.sha)
    new_tree = repo.create_git_tree(tree.tree, [dict(path=file_path, mode='100644', type='blob', content=file_content)])
    new_commit = repo.create_git_commit("Updated accounts.ts", new_tree, [commit])
    git.edit(sha=new_commit.sha)

    return {
        'statusCode': 200,
        'body': 'Updated accounts.ts successfully.'
    }
