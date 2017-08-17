# encoding: utf-8

require 'google_drive'
require 'csv'
require 'json'

desc "Reads csv info and shots them to data folder"
task :read_csv do

  session = GoogleDrive::Session.from_config("config.json")

  locations = [
    {
      location: 'Niterói',
      courses: '',
      disciplines: '',
      liberate_30_min_before: false
    }
  ]

  # loading courses

  result = {
    courses: []
  }

  locations.each do |location|
    location_name = location[:location]

    ws = session.spreadsheet_by_key(location[:courses]).worksheets[0]

    puts "Loading #{location_name} courses..."

    (1..ws.num_rows).each do |index|
      row = ws.rows[index]

      if row
        hash_result = {}

        hash_result[:name] = row[0]
        hash_result[:location] = location_name
        result[:courses] << hash_result
      end
    end

  end

  File.open('data/courses.json', 'w:UTF-8') do |f|
    f.write(result.to_json)
  end


  # Loading disciplines

  result = {
    disciplines: []
  }

  locations.each do |location|
    location_name = location[:location]

    ws = session.spreadsheet_by_key(location[:disciplines]).worksheets[0]

    puts "Loading #{location_name} disciplines..."

    (1..ws.num_rows).each do |index|
      row = ws.rows[index]

      if row
        hash_result = {}

        hash_result[:name]            = row[0]
        hash_result[:ap1_local]       = row[1]
        hash_result[:ap1_date]        = row[2]
        hash_result[:ap1_time]        = row[3]
        hash_result[:ap2_local]       = row[4]
        hash_result[:ap2_date]        = row[5]
        hash_result[:ap2_time]        = row[6]
        hash_result[:ap3_local]       = row[7]
        hash_result[:ap3_date]        = row[8]
        hash_result[:ap3_time]        = row[9]
        hash_result[:ad1_date]        = row[10]
        hash_result[:ad2_date]        = row[11]
        hash_result[:tutor]           = row[12]
        hash_result[:tutorship_hour]  = row[13]
        hash_result[:tutorship_local] = row[14]
        hash_result[:course]          = row[15]
        hash_result[:location]        = location_name
        result[:disciplines]   << hash_result
      end
    end
  end

  File.open('data/disciplines.json', 'w:UTF-8') do |f|
    f.write(result.to_json)
  end

  # Loading locations

  result = {
    locations: []
  }

  puts 'Loading locations...'

  locations.each do |location|
    location_name = location[:location]

    puts "Saving #{location_name} location"

    hash_result = {}

    hash_result[:name] = location_name
    hash_result[:liberate_30_min_before] = location[:liberate_30_min_before]
    result[:locations] << hash_result
  end

  File.open('data/locations.json', 'w:UTF-8') do |f|
    f.write(result.to_json)
  end

end